import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Avatar from './avatar';

describe('Avatar', () => {
    it('renders the image when a source is given', () => {
        render(<Avatar name="Jane Cooper" src="https://example.test/jane.jpg" />);
        const img = screen.getByRole('presentation', { hidden: true }) as HTMLImageElement;
        expect(img.tagName).toBe('IMG');
        expect(img.src).toBe('https://example.test/jane.jpg');
    });

    it('falls back to initials when there is no source', () => {
        render(<Avatar name="Jane Cooper" />);
        expect(screen.getByText('JC')).toBeInTheDocument();
    });

    it('uses the first two letters for a single-word name', () => {
        render(<Avatar name="Prince" />);
        expect(screen.getByText('PR')).toBeInTheDocument();
    });

    it('uses the first and last initial for a three-part name', () => {
        render(<Avatar name="Ada King Lovelace" />);
        expect(screen.getByText('AL')).toBeInTheDocument();
    });

    it('does not crash on an empty name', () => {
        render(<Avatar name="   " />);
        expect(screen.getByText('?')).toBeInTheDocument();
    });

    it('gives the same person the same tint every time', () => {
        const { container: first } = render(<Avatar name="Jane Cooper" />);
        const { container: second } = render(<Avatar name="Jane Cooper" />);
        const tint = (el: HTMLElement) =>
            (el.querySelector('[style*="background-color"]') as HTMLElement).style.backgroundColor;
        expect(tint(first)).toBe(tint(second));
    });

    it('falls back to initials when the image fails to load', async () => {
        render(<Avatar name="Jane Cooper" src="https://example.test/missing.jpg" />);
        const img = screen.getByRole('presentation', { hidden: true });
        img.dispatchEvent(new Event('error', { bubbles: false }));
        expect(await screen.findByText('JC')).toBeInTheDocument();
    });

    it('announces presence as text, not colour alone', () => {
        render(<Avatar name="Jane Cooper" online />);
        expect(screen.getByText('Online')).toBeInTheDocument();
    });

    it('omits the presence text when offline', () => {
        render(<Avatar name="Jane Cooper" />);
        expect(screen.queryByText('Online')).not.toBeInTheDocument();
    });

    it('renders a drawn glyph rather than initials for the global room', () => {
        const { container } = render(<Avatar name="Global Community" variant="global" />);
        expect(container.querySelector('svg')).toBeInTheDocument();
        expect(screen.queryByText('GC')).not.toBeInTheDocument();
    });
});
