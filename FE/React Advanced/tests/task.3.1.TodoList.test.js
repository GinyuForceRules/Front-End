import React from 'react';
import { render, screen } from '@testing-library/react';
import { TodoList } from '../src/components';

describe('Task 3.1: TodoList Component', () => {
    test('should render empty list initially', () => {
        const { container } = render(<TodoList />);
        const ul = container.querySelector('ul');
        expect(ul).toBeInTheDocument();
        expect(ul.children.length).toBe(0);
    });

    test('should have div as root element containing ul', () => {
        const { container } = render(<TodoList />);
        expect(container.firstChild.tagName).toBe('DIV');
        expect(container.querySelector('ul')).toBeInTheDocument();
    });
});