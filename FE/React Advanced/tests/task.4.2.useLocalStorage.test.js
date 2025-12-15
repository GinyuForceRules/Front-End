import React from 'react';
import { render, screen } from '@testing-library/react';
import { PersistentInput } from '../src/components';

describe('Task 4.2: useLocalStorage Hook and PersistentInput Component', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test('should render input element', () => {
        render(<PersistentInput />);
        const input = screen.getByRole('textbox');
        expect(input).toBeInTheDocument();
    });

    test('should render paragraph showing saved value', () => {
        render(<PersistentInput />);
        const paragraph = screen.getByText(/./);
        expect(paragraph.tagName).toBe('P');
    });
});