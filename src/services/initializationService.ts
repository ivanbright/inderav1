import { authService } from './authService';
import { seedService } from './seedService';

class InitializationService {
    private initialized = false;

    async initializeApp(): Promise<void> {
        if (this.initialized) return;

        try {
            // Check if Firebase services are available
            const firebaseAvailable = await this.checkFirebaseAvailability();

            if (firebaseAvailable) {
                // Check if demo data already exists by trying to sign in
                const hasDemoData = await this.checkDemoDataExists();

                if (!hasDemoData) {
                    await seedService.seedDemoData();
                }
            }

            this.initialized = true;
        } catch (error) {
            console.error('App initialization failed:', error);
            // Don't throw error to prevent app crash - fallback to mock data
            this.initialized = true;
        }
    }

    private async checkFirebaseAvailability(): Promise<boolean> {
        try {
            // Test basic Firebase connectivity
            const { db } = await import('./firebase');
            const { doc, getDoc } = await import('firebase/firestore');

            // Try to read a non-existent document (should fail gracefully if Firebase is configured)
            const testDoc = doc(db, 'test', 'connectivity');
            await getDoc(testDoc);

            return true;
        } catch (error: any) {
            // Check for specific Firebase errors that indicate misconfiguration
            if (error?.code === 'permission-denied' ||
                error?.code === 'unavailable' ||
                error?.message?.includes('network-request-failed')) {
                return false;
            }

            // Other errors might still mean Firebase is available but needs setup
            return false;
        }
    }

    private async checkDemoDataExists(): Promise<boolean> {
        try {
            // Try to sign in with demo credentials to check if data exists
            await authService.signIn('parent@demo.com', 'demo123');

            // If sign in succeeds, data exists
            const currentUser = authService.getCurrentUser();
            if (currentUser) {
                await authService.signOut(); // Sign out after checking
                return true;
            }

            return false;
        } catch (error) {
            // If sign in fails, assume no data exists
            return false;
        }
    }

    async resetDemoData(): Promise<void> {
        try {
            // Sign out current user if any
            if (authService.getCurrentUser()) {
                await authService.signOut();
            }

            // Re-seed data
            await seedService.seedDemoData();
        } catch (error) {
            console.error('Failed to reset demo data:', error);
            throw error;
        }
    }

    isInitialized(): boolean {
        return this.initialized;
    }
}

export const initializationService = new InitializationService();