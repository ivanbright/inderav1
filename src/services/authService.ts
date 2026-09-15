import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User,
    sendPasswordResetEmail,
    updatePassword,
    updateProfile,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    GoogleAuthProvider,
    signInWithCredential,
    getIdTokenResult
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { auth, db, functions } from './firebase';

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    role: 'parent' | 'teacher' | 'admin';
    schoolId: string;
    profileComplete: boolean;
    createdAt: string;
    lastActive: string;
    // Role-specific fields
    parentProfile?: {
        childrenIds: string[];
        phone: string;
        emergencyContact: string;
    };
    teacherProfile?: {
        subjects: string[];
        classIds: string[];
        employeeId: string;
    };
    adminProfile?: {
        permissions: string[];
        managedSchoolIds: string[];
    };
}

class AuthService {
    private currentUser: User | null = null;
    private currentUserProfile: UserProfile | null = null;

    constructor() {
        onAuthStateChanged(auth, this.onAuthStateChanged.bind(this));
    }

    private async onAuthStateChanged(user: User | null) {
        this.currentUser = user;
        if (user) {
            await this.loadUserProfile(user.uid);
        } else {
            this.currentUserProfile = null;
        }
    }

    private async loadUserProfile(uid: string): Promise<void> {
        try {
            const userDoc = await getDoc(doc(db, 'users', uid));
            if (userDoc.exists()) {
                this.currentUserProfile = userDoc.data() as UserProfile;
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
        }
    }

    async signIn(email: string, password: string): Promise<{ user: User; profile: UserProfile }> {
        let user: User;
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            user = userCredential.user;
        } catch (error: any) {
            console.error('Sign-in failed:', error.code, error.message);
            throw new Error(this.getAuthErrorMessage(error.code));
        }

        // Update last active timestamp (use setDoc so it creates the doc if missing)
        try {
            await setDoc(doc(db, 'users', user.uid), {
                lastActive: new Date().toISOString()
            }, { merge: true });
        } catch (error) {
            console.warn('Could not update user document:', error);
        }

        // Load user profile
        await this.loadUserProfile(user.uid);

        // Repair known demo accounts that may have been created without a profile
        if (!this.currentUserProfile || !this.currentUserProfile.role) {
            await this.ensureDemoProfile(user);
            await this.loadUserProfile(user.uid);
        }

        if (!this.currentUserProfile || !this.currentUserProfile.role) {
            throw new Error('User profile not found. Please contact your administrator to set up your account.');
        }

        return { user, profile: this.currentUserProfile };
    }

    async registerUser(
        email: string,
        password: string,
        role: UserProfile['role'],
        inviteCode?: string
    ): Promise<{ user: User; profile: UserProfile } | { pendingApproval: true }> {
        let userCredential;
        try {
            userCredential = await createUserWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
            throw new Error(this.getAuthErrorMessage(error.code));
        }

        const newUser = userCredential.user;

        // Verify email is required before staff roles can log in
        await sendEmailVerification(newUser);

        // Finalize on the server: validate invite (teacher/admin), assign custom
        // claims (role + status), create the users/ profile doc, send approval/failed
        // notification. Parent becomes 'active' immediately; teacher/admin become
        // 'pending_approval' and must be approved by an admin.
        if (this.hasCloudFunctions()) {
            const finalizeRegistration = httpsCallable(functions, 'finalizeRegistration');
            await finalizeRegistration({
                requestedRole: role,
                inviteCode: inviteCode || '',
            });
        } else {
            // Fallback (no deployed functions): write the profile locally so this
            // NEVER leaves the account half-created, but note that role/status
            // gates depend on custom claims and require the function deploy.
            const now = new Date().toISOString();
            await setDoc(doc(db, 'users', newUser.uid), {
                uid: newUser.uid,
                email,
                displayName: '',
                role: role === 'parent' ? 'parent' : 'pending_approval',
                schoolId: 'oakridge-academy',
                profileComplete: false,
                status: role === 'parent' ? 'active' : 'pending_approval',
                createdAt: now,
                updatedAt: now,
            });
            console.warn('Cloud Functions not deployed — signup gating is not enforced.');
        }

        // Force claim refresh so custom claims (role/status) are available on the
        // ID token right away.
        try {
            await newUser.getIdToken(true);
        } catch (error) {
            console.warn('Could not force-refresh token:', error);
        }

        this.currentUser = newUser;

        // If staff role requires admin approval, return a pending-approval marker
        if (role !== 'parent') {
            return { pendingApproval: true };
        }

        await this.loadUserProfile(newUser.uid);
        return { user: newUser, profile: this.currentUserProfile as UserProfile };
    }

    async googleSignIn(
        accessToken: string,
        idToken: string,
        role: UserProfile['role'] = 'parent'
    ): Promise<{ user: User; profile: UserProfile } | { pendingApproval: true }> {
        let userCredential;
        try {
            const credential = GoogleAuthProvider.credential(idToken, accessToken);
            userCredential = await signInWithCredential(auth, credential);
        } catch (error: any) {
            throw new Error(this.getAuthErrorMessage(error.code));
        }

        const newUser = userCredential.user;
        this.currentUser = newUser;

        // First-time Google users: finalize to assign claims + profile doc.
        try {
            const freshClaims = await this.getMyClaims(newUser);
            if (!freshClaims.role) {
                if (this.hasCloudFunctions()) {
                    const finalizeRegistration = httpsCallable(functions, 'finalizeRegistration');
                    await finalizeRegistration({
                        requestedRole: role,
                        inviteCode: '',
                        googleOAuth: true,
                    });
                } else {
                    const now = new Date().toISOString();
                    await setDoc(doc(db, 'users', newUser.uid), {
                        uid: newUser.uid,
                        email: newUser.email || '',
                        displayName: newUser.displayName || '',
                        role: role === 'parent' ? 'parent' : 'pending_approval',
                        schoolId: 'oakridge-academy',
                        profileComplete: false,
                        status: role === 'parent' ? 'active' : 'pending_approval',
                        createdAt: now,
                        updatedAt: now,
                    });
                }
            }
        } catch (error) {
            console.error('Error finalizing Google account:', error);
        }

        await this.loadUserProfile(newUser.uid);
        if (role !== 'parent') {
            return { pendingApproval: true };
        }

        return { user: newUser, profile: this.currentUserProfile as UserProfile };
    }

    private hasCloudFunctions(): boolean {
        return typeof httpsCallable === 'function';
    }

    private async getMyClaims(user: User): Promise<{ role?: string; status?: string }> {
        try {
            if (!this.hasCloudFunctions()) return {};
            const getMyClaims = httpsCallable<{ role?: string; status?: string }, { role?: string; status?: string }>(functions, 'getMyClaims');
            const result = await getMyClaims();
            return result.data || {};
        } catch (error) {
            return {};
        }
    }

    async getUserClaims(): Promise<{ role: string; status: string } | null> {
        if (!this.currentUser) return null;
        const tokenResult = await this.currentUser.getIdTokenResult();
        const claims = tokenResult.claims;
        return {
            role: (claims.role as string) || '',
            status: (claims.status as string) || '',
        };
    }

    async refreshUserProfile(): Promise<void> {
        if (!this.currentUser) return;
        await this.loadUserProfile(this.currentUser.uid);
    }

    private async ensureDemoProfile(user: User): Promise<void> {
        const demoProfiles: Record<string, { displayName: string; role: UserProfile['role']; build: () => Partial<UserProfile> }> = {
            'parent@demo.com': {
                displayName: 'Nomsa Mbeki',
                role: 'parent',
                build: () => ({
                    parentProfile: {
                        childrenIds: ['student-1', 'student-2'],
                        phone: '+27 82 123 4567',
                        emergencyContact: '+27 83 987 6543',
                    },
                }),
            },
            'teacher@demo.com': {
                displayName: 'Sarah Johnson',
                role: 'teacher',
                build: () => ({
                    teacherProfile: {
                        subjects: ['mathematics'],
                        classIds: ['class-8a'],
                        employeeId: 'T001',
                    },
                }),
            },
            'admin@demo.com': {
                displayName: 'Principal Mokoena',
                role: 'admin',
                build: () => ({
                    adminProfile: {
                        permissions: ['full_access'],
                        managedSchoolIds: ['oakridge-academy'],
                    },
                }),
            },
        };

        const demo = demoProfiles[user.email?.toLowerCase() || ''];
        if (!demo) return;

        try {
            const now = new Date().toISOString();
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                email: user.email,
                displayName: demo.displayName,
                role: demo.role as UserProfile['role'],
                schoolId: 'oakridge-academy',
                profileComplete: true,
                createdAt: now,
                lastActive: now,
                ...demo.build(),
            }, { merge: true });
            console.log(`Repaired demo profile for ${user.email}`);
        } catch (error) {
            console.warn('Could not repair demo profile:', error);
        }
    }

    async signOut(): Promise<void> {
        try {
            await signOut(auth);
            this.currentUser = null;
            this.currentUserProfile = null;
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    }

    async resetPassword(email: string): Promise<void> {
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (error: any) {
            throw new Error(this.getAuthErrorMessage(error.code));
        }
    }

    async updateUserPassword(newPassword: string): Promise<void> {
        if (!this.currentUser) {
            throw new Error('No authenticated user');
        }

        try {
            await updatePassword(this.currentUser, newPassword);
        } catch (error: any) {
            throw new Error(this.getAuthErrorMessage(error.code));
        }
    }

    async updateUserProfile(updates: Partial<UserProfile>): Promise<void> {
        if (!this.currentUser || !this.currentUserProfile) {
            throw new Error('No authenticated user');
        }

        try {
            const userRef = doc(db, 'users', this.currentUser.uid);
            await updateDoc(userRef, {
                ...updates,
                updatedAt: new Date().toISOString()
            });

            // Update display name in Auth if provided
            if (updates.displayName) {
                await updateProfile(this.currentUser, {
                    displayName: updates.displayName
                });
            }

            // Reload profile
            await this.loadUserProfile(this.currentUser.uid);
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw error;
        }
    }

    getCurrentUser(): User | null {
        return this.currentUser;
    }

    getCurrentUserProfile(): UserProfile | null {
        return this.currentUserProfile;
    }

    isAuthenticated(): boolean {
        return this.currentUser !== null;
    }

    getUserRole(): string | null {
        return this.currentUserProfile?.role || null;
    }

    private getAuthErrorMessage(errorCode: string): string {
        switch (errorCode) {
            case 'auth/user-not-found':
            case 'auth/invalid-credential':
                return 'No account found for this email/password. Check your credentials or create a demo user first.';
            case 'auth/wrong-password':
                return 'Incorrect password.';
            case 'auth/invalid-email':
                return 'Invalid email address.';
            case 'auth/user-disabled':
                return 'This account has been disabled.';
            case 'auth/too-many-requests':
                return 'Too many failed attempts. Please try again later.';
            case 'auth/network-request-failed':
                return 'Network error. Please check your connection.';
            case 'auth/invalid-api-key':
                return 'Firebase API key is invalid. Check your Firebase configuration.';
            case 'auth/operation-not-allowed':
                return 'Email/password sign-in is not enabled in the Firebase Auth console.';
            case 'auth/unauthorized-domain':
                return 'This domain is not authorized for Firebase Authentication.';
            default:
                return `Authentication failed (${errorCode || 'unknown'}). Please try again.`;
        }
    }

    // Listen to auth state changes. The profile is loaded (and demo accounts
    // self-repaired) BEFORE the callback fires, so callers never receive a
    // stale profile from a previous user or a null profile during a switch.
    onAuthStateChange(callback: (user: User | null, profile: UserProfile | null) => void) {
        return onAuthStateChanged(auth, async (user) => {
            if (user) {
                await this.loadUserProfile(user.uid);

                // Repair known demo accounts that may be missing a profile
                if (!this.currentUserProfile || !this.currentUserProfile.role) {
                    await this.ensureDemoProfile(user);
                    await this.loadUserProfile(user.uid);
                }
            } else {
                this.currentUserProfile = null;
            }

            callback(user, this.currentUserProfile);
        });
    }
}

export const authService = new AuthService();
export default authService;