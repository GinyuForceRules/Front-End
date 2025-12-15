import React from 'react';
import { render, screen } from '@testing-library/react';
import { ShoppingCart } from '../src/components';

describe('Task 3.2: ShoppingCart Component', () => {
    test('should display initial total as 0', () => {
        render(<ShoppingCart />);
        expect(screen.getByText('Total: $0')).toBeInTheDocument();
    });

    test('should render paragraph with total', () => {
        render(<ShoppingCart />);
        const paragraph = screen.getByText(/Total:/);
        expect(paragraph.tagName).toBe('P');
    });
});