import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Page } from '../Page';
import { orcamento } from '@/data/copy/orcamento';

// The preview measures layout and loads the PDF toolkit; neither exists in
// jsdom, and neither is what these cases are about.
vi.mock('../Preview', () => ({ Preview: () => null }));

const f = orcamento.form;

function contratante() {
  return screen.getByLabelText(f.contratante) as HTMLInputElement;
}

describe('orçamento editor: clearing the form', () => {
  beforeEach(() => window.localStorage.clear());

  it('keeps the clear button laid out but hidden until there is something to clear', () => {
    render(<Page />);
    const clear = screen.getByText(f.clearDraft);
    expect(clear).toHaveClass('invisible');
    fireEvent.change(contratante(), { target: { value: 'Prefeitura de Jaú' } });
    expect(clear).not.toHaveClass('invisible');
  });

  it('offers to undo a clear and puts the proposal back', () => {
    render(<Page />);
    fireEvent.change(contratante(), { target: { value: 'Prefeitura de Jaú' } });
    fireEvent.click(screen.getByText(f.clearDraft));

    expect(contratante().value).toBe('');
    expect(screen.getByText(f.draftCleared)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: f.undoClear }));
    expect(contratante().value).toBe('Prefeitura de Jaú');
    expect(screen.queryByRole('button', { name: f.undoClear })).not.toBeInTheDocument();
  });

  it('drops the undo once the producer starts a new proposal', () => {
    render(<Page />);
    fireEvent.change(contratante(), { target: { value: 'Prefeitura de Jaú' } });
    fireEvent.click(screen.getByText(f.clearDraft));
    fireEvent.change(contratante(), { target: { value: 'Clube Náutico' } });

    expect(screen.queryByRole('button', { name: f.undoClear })).not.toBeInTheDocument();
    expect(contratante().value).toBe('Clube Náutico');
  });
});
