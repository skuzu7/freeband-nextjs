import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Lightbox, type LightboxItem, type LightboxLabels } from '../Lightbox';

const items = [
  {
    src: '/images/um.jpeg',
    alt: 'Primeiro cartaz',
    aspect: '4/3',
    title: 'Jaú · Baile do Havaí',
    meta: '07/Dez · Clube de Campo',
  },
  {
    src: '/images/dois.jpeg',
    alt: 'Segundo cartaz',
    aspect: '4/3',
    title: 'Itatinga · Virada de Ano',
    meta: '2023 · Prefeitura Municipal',
  },
] satisfies LightboxItem[];

const labels: LightboxLabels = {
  close: 'Fechar',
  prev: 'Anterior',
  next: 'Próximo',
  counter: (index, total) => `${index} de ${total}`,
};

/** The lightbox is controlled: this holds the index the way Cartazes does. */
function Harness() {
  const [index, setIndex] = useState<number | null>(0);
  return <Lightbox items={items} index={index} onClose={() => setIndex(null)} onChange={setIndex} labels={labels} />;
}

describe('Lightbox', () => {
  it('announces the caption when the arrow keys step to another picture', () => {
    render(<Harness />);
    const caption = screen.getByRole('heading', { name: items[0].title }).closest('[aria-live]');
    expect(caption).toHaveAttribute('aria-live', 'polite');
    // Title and meta are separate nodes; atomic has both read as one caption.
    expect(caption).toHaveAttribute('aria-atomic', 'true');
    expect(caption).toHaveTextContent(items[0].meta);

    fireEvent.keyDown(document, { key: 'ArrowRight' });
    // A live region speaks when its own node gets new text, so the node the
    // first caption was in must still be there, now holding the second.
    expect(caption).toBeInTheDocument();
    expect(caption).toHaveTextContent(items[1].title);
    expect(caption).toHaveTextContent(items[1].meta);
    expect(caption).not.toHaveTextContent(items[0].title);
  });
});
