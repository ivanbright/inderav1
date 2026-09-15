import { useState, useEffect } from 'react';
import { databaseService } from '../services/databaseService';
import { BehaviorReport } from '../services/models';
import { useApp } from '../contexts/AppContext';

export interface UseBehaviorReportsResult {
    reports: BehaviorReport[];
    isLoading: boolean;
    error: string | null;
    refreshReports: () => Promise<void>;
    getReportsByDateRange: (startDate: string, endDate: string) => BehaviorReport[];
    getReportsByType: (type: 'positive' | 'neutral' | 'concern') => BehaviorReport[];
    getReportsByCategory: (category: 'academic' | 'social' | 'behavior' | 'participation') => BehaviorReport[];
    getWeeklyAverageRating: () => number;
}

export const useBehaviorReports = (studentId: string): UseBehaviorReportsResult => {
    const { userProfile } = useApp();
    const [reports, setReports] = useState<BehaviorReport[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadReports = async () => {
        if (!userProfile || !studentId) return;

        try {
            setIsLoading(true);
            setError(null);

            // Load behavior reports for the student
            const behaviorReports = await databaseService.getStudentBehaviorReports(studentId);
            setReports(behaviorReports);

        } catch (err: any) {
            console.error('Error loading behavior reports:', err);
            setError(err.message || 'Failed to load behavior reports');
        } finally {
            setIsLoading(false);
        }
    };

    const refreshReports = async () => {
        await loadReports();
    };

    const getReportsByDateRange = (startDate: string, endDate: string): BehaviorReport[] => {
        return reports.filter(report =>
            report.date >= startDate && report.date <= endDate
        );
    };

    const getReportsByType = (type: 'positive' | 'neutral' | 'concern'): BehaviorReport[] => {
        return reports.filter(report => report.type === type);
    };

    const getReportsByCategory = (category: 'academic' | 'social' | 'behavior' | 'participation'): BehaviorReport[] => {
        return reports.filter(report => report.category === category);
    };

    const getWeeklyAverageRating = (): number => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const weekAgoString = oneWeekAgo.toISOString().split('T')[0];

        const weeklyReports = getReportsByDateRange(weekAgoString, new Date().toISOString().split('T')[0]);

        if (weeklyReports.length === 0) return 0;

        const totalRating = weeklyReports.reduce((sum, report) => sum + report.rating, 0);
        return Math.round((totalRating / weeklyReports.length) * 10) / 10; // Round to 1 decimal
    };

    useEffect(() => {
        loadReports();
    }, [userProfile, studentId]);

    return {
        reports,
        isLoading,
        error,
        refreshReports,
        getReportsByDateRange,
        getReportsByType,
        getReportsByCategory,
        getWeeklyAverageRating,
    };
};