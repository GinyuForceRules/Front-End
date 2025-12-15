import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { FetchUser } from '../src/components';

describe('Task 1.1: FetchUser Component', () => {
    test('should show loading initially and then user ID', async () => {
        render(<FetchUser userId={123} />);
        
        expect(screen.getByText('Loading...')).toBeInTheDocument();
        
        await waitFor(() => {
            expect(screen.getByText('User ID: 123')).toBeInTheDocument();
        }, { timeout: 200 });
    });

    test('should update when userId prop changes', async () => {
        const { rerender } = render(<FetchUser userId={1} />);
        
        await waitFor(() => {
            expect(screen.getByText('User ID: 1')).toBeInTheDocument();
        }, { timeout: 200 });
        
        rerender(<FetchUser userId={2} />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
        
        await waitFor(() => {
            expect(screen.getByText('User ID: 2')).toBeInTheDocument();
        }, { timeout: 200 });
    });
});