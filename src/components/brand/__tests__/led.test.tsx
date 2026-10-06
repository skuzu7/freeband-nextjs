// The LED motifs that are plain markup: what they put in the HTML is what a
// visitor without JavaScript, a search engine and a screen reader all get.
import { fireEvent, render, screen, within } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { LedNumber } from '../LedNumber';
import { LedSign } from '../LedSign';
import { LedWordmark } from '../LedWordmark';
import { Wordmark } from '../Wordmark';
import { WORDMARK } from '@/design/wordmark';

describe('Wordmark', () => {
  // A gradient in objectBoundingBox units is ignored for a shape whose box has
  // no width or height, and every stem and crossbar of the mark is one: the
  // acrylic face went unpainted on all the straight strokes.
  it('paints the acrylic with one gradient in user space, spanning the whole mark', () => {
    const { container } = render(<Wordmark acrylic />);
    const gradient = container.querySelector('linearGradient')!;
    expect(gradient).toHaveAttribute('gradientUnits', 'userSpaceOnUse');
    const { y, height } = WORDMARK.viewBox;
    expect(Number(gradient.getAttribute('y1'))).toBe(y);
    expect(Number(gradient.getAttribute('y2'))).toBe(y + height);
    expect(gradient.getAttribute('x1')).toBe(gradient.getAttribute('x2'));
    for (const attr of ['x1', 'y1', 'x2', 'y2']) expect(gradient.getAttribute(attr)).not.toContain('%');
  });

  it('paints in currentColor, with no gradient, when it is not the acrylic', () => {
    const { container } = render(<Wordmark />);
    expect(container.querySelector('linearGradient')).toBeNull();
    expect(container.querySelector('g')).toHaveAttribute('stroke', 'currentColor');
  });
});

describe('LedWordmark', () => {
  it('is one image named after the band, with both drawings in the markup', () => {
    const html = renderToStaticMarkup(<LedWordmark label="Freeband" />);
    render(<LedWordmark label="Freeband" />);
    const mark = screen.getByRole('img', { name: 'Freeband' });
    expect(mark.querySelector('.led-wordmark-dots path')).not.toBeNull();
    expect(mark.querySelector('.led-wordmark-acrylic')).not.toBeNull();
    // Nothing waits on a script to show: no element is parked at opacity 0.
    expect(html).not.toMatch(/opacity-0/);
    expect(html).not.toContain('<canvas');
  });

  it('draws the dots as a handful of paths, not one element per dot', () => {
    const { container } = render(<LedWordmark label="Freeband" />);
    const dots = container.querySelectorAll('.led-wordmark-dots path');
    expect(dots.length).toBeGreaterThan(0);
    expect(dots.length).toBeLessThanOrEqual(3);
    expect(container.querySelectorAll('.led-wordmark-dots circle')).toHaveLength(0);
  });
});

describe('LedNumber', () => {
  it('reads as the number and hides the matrix from assistive tech', () => {
    const { container } = render(<LedNumber value="1969" label="fundada em Jaú/SP" />);
    expect(screen.getByText('1969')).toHaveClass('sr-only');
    expect(screen.getByText('fundada em Jaú/SP')).toBeInTheDocument();
    for (const svg of container.querySelectorAll('svg')) expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  it('costs two paths however many digits it shows', () => {
    const { container } = render(<LedNumber value="1969" />);
    expect(container.querySelectorAll('path')).toHaveLength(2);
    expect(container.querySelectorAll('circle')).toHaveLength(0);
  });

  it('sweeps on by default, staggers on request and stands still when told to', () => {
    const { container, rerender } = render(<LedNumber value="11" delayMs={240} />);
    const lit = () => container.querySelectorAll('svg')[1] as SVGElement;
    expect(lit()).toHaveClass('led-number-on');
    expect(lit().style.getPropertyValue('--led-delay')).toBe('240ms');
    rerender(<LedNumber value="11" animate={false} />);
    expect(lit()).not.toHaveClass('led-number-on');
  });
});

describe('LedSign', () => {
  const props = {
    items: ['Jimmy Cliff', 'Roupa Nova'],
    label: 'Nomes',
    pauseLabel: 'Pausar o letreiro',
    playLabel: 'Reproduzir o letreiro',
  };

  it('offers the names once to assistive tech and hides the copy that closes the loop', () => {
    render(<LedSign {...props} />);
    const region = screen.getByRole('region', { name: 'Nomes' });
    expect(within(region).getAllByRole('list')).toHaveLength(1);
    expect(within(region).getAllByRole('listitem').map((li) => li.textContent)).toEqual(props.items);
    expect(region.querySelectorAll('ul')).toHaveLength(2);
  });

  it('pauses on its one control, named after what a press does', () => {
    render(<LedSign {...props} />);
    const region = screen.getByRole('region', { name: 'Nomes' });
    const control = screen.getByRole('button', { name: props.pauseLabel });
    expect(region).not.toHaveAttribute('data-paused');

    fireEvent.click(control);
    expect(region).toHaveAttribute('data-paused');
    expect(control).toHaveAccessibleName(props.playLabel);
    expect(control).not.toHaveAttribute('aria-pressed');

    fireEvent.click(control);
    expect(region).not.toHaveAttribute('data-paused');
  });
});
