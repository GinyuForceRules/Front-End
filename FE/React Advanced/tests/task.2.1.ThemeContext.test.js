import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, ThemeDisplay } from '../src/components';

describe('Task 2.1: ThemeContext', () => {
    test('should display theme from context', () => {
        render(
            <ThemeProvider>
                <ThemeDisplay />
            </ThemeProvider>
        );
        
        expect(screen.getByText('Current theme: dark')).toBeInTheDocument();
    });

    test('ThemeDisplay should render paragraph element', () => {
        render(
            <ThemeProvider>
                <ThemeDisplay />
            </ThemeProvider>
        );
        
        const paragraph = screen.getByText(/Current theme:/);
        expect(paragraph.tagName).toBe('P');
    });
});