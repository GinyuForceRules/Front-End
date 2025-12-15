import React from 'react';
import { render, screen } from '@testing-library/react';
import { DataDisplayWithLoading } from '../src/components';

describe('Task 5.1: withLoading HOC', () => {
    test('should show loading when isLoading is true', () => {
        render(<DataDisplayWithLoading isLoading={true} data="Test" />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('should show component when isLoading is false', () => {
        render(<DataDisplayWithLoading isLoading={false} data="Test Data" />);
        expect(screen.getByText('Test Data')).toBeInTheDocument();
    });

    test('loading message should be in div', () => {
        const { container } = render(<DataDisplayWithLoading isLoading={true} data="Test" />);
        const loadingDiv = screen.getByText('Loading...').parentElement;
        expect(loadingDiv.tagName).toBe('DIV');
    });
});