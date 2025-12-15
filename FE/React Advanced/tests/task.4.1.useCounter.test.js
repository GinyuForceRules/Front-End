import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CounterWithHook } from '../src/components';

describe('Task 4.1: useCounter Hook and CounterWithHook Component', () => {
    test('should render counter with initial value', () => {
        render(<CounterWithHook />);
        expect(screen.getByText(/0/)).toBeInTheDocument();
    });

    test('should have increment, decrement, and reset buttons', () => {
        render(<CounterWithHook />);
        expect(screen.getByText('Increment')).toBeInTheDocument();
        expect(screen.getByText('Decrement')).toBeInTheDocument();
        expect(screen.getByText('Reset')).toBeInTheDocument();
    });

    test('should increment counter', () => {
        render(<CounterWithHook />);
        const incrementBtn = screen.getByText('Increment');
        fireEvent.click(incrementBtn);
        expect(screen.getByText(/1/)).toBeInTheDocument();
    });
});