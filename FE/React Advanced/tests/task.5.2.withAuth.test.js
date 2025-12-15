import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProtectedContentWithAuth } from '../src/components';

describe('Task 5.2: withAuth HOC', () => {
    test('should show access denied when not authenticated', () => {
        render(<ProtectedContentWithAuth isAuthenticated={false} />);
        expect(screen.getByText('Access Denied')).toBeInTheDocument();
    });

    test('should show component when authenticated', () => {
        render(<ProtectedContentWithAuth isAuthenticated={true} />);
        expect(screen.getByText('Secret Content')).toBeInTheDocument();
    });

    test('access denied should be in div', () => {
        const { container } = render(<ProtectedContentWithAuth isAuthenticated={false} />);
        const deniedDiv = screen.getByText('Access Denied').parentElement;
        expect(deniedDiv.tagName).toBe('DIV');
    });
});