import { useState, useEffect } from 'react';
import { where, orderBy } from 'firebase/firestore';
import { databaseService } from '../services/databaseService';
import { CalendarEvent } from '../services/models';
import { useApp } from '../contexts/AppContext';

export interface UseCalendarDataResult {
    events: CalendarEvent[];
    isLoading: boolean;
    error: string | null;
    refreshEvents: () => Promise<void>;
}

export const useCalendarData = (): UseCalendarDataResult => {
    const { userProfile, parent } = useApp();
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadEvents = async () => {
        if (!userProfile) return;

        try {
            setIsLoading(true);
            setError(null);

            let calendarEvents: CalendarEvent[] = [];

            if (userProfile.role === 'parent' && parent) {
                // For parents, get events relevant to their children
                calendarEvents = await databaseService.getCalendarEventsForParent(parent.id);
            } else {
                // For teachers and admins, get all school events
                calendarEvents = await databaseService.list<CalendarEvent>('calendarEvents', [
                    where('schoolId', '==', userProfile.schoolId),
                    where('isActive', '==', true),
                    orderBy('startDate', 'asc')
                ]);
            }

            // Filter events to show current and future events
            const currentDate = new Date().toISOString().split('T')[0];
            const filteredEvents = calendarEvents.filter(event =>
                event.startDate >= currentDate ||
                (event.endDate && event.endDate >= currentDate)
            );

            setEvents(filteredEvents);
        } catch (err: any) {
            console.error('Error loading calendar events:', err);
            setError(err.message || 'Failed to load calendar events');
        } finally {
            setIsLoading(false);
        }
    };

    const refreshEvents = async () => {
        await loadEvents();
    };

    useEffect(() => {
        loadEvents();
    }, [userProfile, parent]);

    return {
        events,
        isLoading,
        error,
        refreshEvents,
    };
};