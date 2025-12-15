import React from 'react';
import { render } from '@testing-library/react';
import { DocumentTitle } from '../src/components';

describe('Task 1.2: DocumentTitle Component', () => {
    const originalTitle = document.title;

    afterEach(() => {
        document.title = originalTitle;
    });

    test('should update document title', () => {
        render(<DocumentTitle title="Test Page" />);
        expect(document.title).toBe('Test Page');
    });

    test('should update when title prop changes', () => {
        const { rerender } = render(<DocumentTitle title="First Title" />);
        expect(document.title).toBe('First Title');
        
        rerender(<DocumentTitle title="Second Title" />);
        expect(document.title).toBe('Second Title');
    });

    test('should return null', () => {
        const { container } = render(<DocumentTitle title="Test" />);
        expect(container.firstChild).toBeNull();
    });
});