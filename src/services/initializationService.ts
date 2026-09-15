import { authService } from './authService';
import { seedService } from './seedService';

class InitializationService {
    private initialized = false;

    async initializeApp(): Promise<void> {
        if (this.initialized) return;

        try {
            console.log('Initializing Indera app...');

            // Check if demo data already exists by trying to sign in
            const hasDemoData = await this.checkDemoDataExists();

            if (!hasDemoData) {
                console.log('No demo data found, seeding initial data...');
                await seedService.seedDemoData();
                console.log('Demo data seeded successfully');
            } else {
                console.log('Demo data already exists, skipping seeding');
            }

            this.initialized = true;
            console.log('App initialization complete');
        } catch (error) {
            console.error('App initialization failed:', error);
            // Don't throw error to prevent app crash - fallback to mock data
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
            console.log('Resetting demo data...');

            // Sign out current user if any
            if (authService.getCurrentUser()) {
                await authService.signOut();
            }

            // Re-seed data
            await seedService.seedDemoData();

            console.log('Demo data reset successfully');
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