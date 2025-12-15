import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { WindowResize } from '../src/components';

describe('Task 1.3: WindowResize Component', () => {
    test('should display current window width', () => {
        render(<WindowResize />);
        const widthText = screen.getByText(/Width: \d+px/);
        expect(widthText).toBeInTheDocument();
    });

    test('should update width on window resize', () => {
        render(<WindowResize />);
        
        act(() => {
            global.innerWidth = 1024;
            global.dispatchEvent(new Event('resize'));
        });
        
        expect(screen.getByText('Width: 1024px')).toBeInTheDocument();
    });
});