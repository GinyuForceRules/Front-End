import React from 'react';
import { render, screen } from '@testing-library/react';
import { UserProvider, UserInfo } from '../src/components';

describe('Task 2.2: UserContext', () => {
    test('should display user info from context', () => {
        render(
            <UserProvider>
                <UserInfo />
            </UserProvider>
        );
        
        expect(screen.getByText('Name: Guest, Age: 0')).toBeInTheDocument();
    });

    test('UserInfo should render div element', () => {
        const { container } = render(
            <UserProvider>
                <UserInfo />
            </UserProvider>
        );
        
        expect(container.firstChild.tagName).toBe('DIV');
    });
});