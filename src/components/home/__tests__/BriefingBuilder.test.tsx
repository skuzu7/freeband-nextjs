import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useBriefingStore } from '@/stores/useBriefingStore';
import { BriefingBuilder } from '../BriefingBuilder';

describe('BriefingBuilder', () => {
  beforeEach(() => {
    useBriefingStore.getState().resetBriefing();
  });

  it('walks through all 3 guided steps, formats native ISO date, and updates WhatsApp link', () => {
    render(<BriefingBuilder />);

    // Step 1: Select event format and continue
    const formatBtn = screen.getByRole('button', { name: 'Formatura' });
    fireEvent.click(formatBtn);
    expect(formatBtn).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(screen.getByRole('button', { name: /Continuar: Estrutura/i }));

    // Step 2: Select stage structure and continue
    const pkgBtn = screen.getByRole('button', { name: /Show Essencial/i });
    fireEvent.click(pkgBtn);
    expect(pkgBtn).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(screen.getByRole('button', { name: /Continuar: Data e cidade/i }));

    // Step 3: Pick native ISO date + city
    const dateInput = screen.getByLabelText(/Data prevista/i);
    fireEvent.change(dateInput, { target: { value: '2026-11-14' } });

    const cityInput = screen.getByLabelText(/Cidade \/ UF/i);
    fireEvent.change(cityInput, { target: { value: 'Jaú/SP' } });

    const preview = screen.getByTestId('briefing-preview');
    expect(preview.textContent).toContain('Formato: Formatura');
    expect(preview.textContent).toContain('Estrutura: Show Essencial');
    expect(preview.textContent).toContain('Data prevista: 14/11/2026');
    expect(preview.textContent).toContain('Cidade/UF: Jaú/SP');

    const cta = screen.getByRole('link', { name: /Enviar briefing pelo WhatsApp/i });
    const href = cta.getAttribute('href') ?? '';
    expect(href).toContain('https://wa.me/5516997732749?text=');
    expect(decodeURIComponent(href)).toContain('Formatura');
    expect(decodeURIComponent(href)).toContain('Show Essencial');
    expect(decodeURIComponent(href)).toContain('14/11/2026');
    expect(decodeURIComponent(href)).toContain('Jaú/SP');
  });

  it('supports toggling flexible date when the buyer has not picked a date yet', () => {
    render(<BriefingBuilder />);

    // Jump straight to step 3 via interactive stepper
    fireEvent.click(screen.getByRole('button', { name: /Data e local/i }));

    const flexBtn = screen.getByRole('button', { name: /Ainda não tenho data fechada/i });
    fireEvent.click(flexBtn);
    expect(flexBtn).toHaveAttribute('aria-pressed', 'true');

    const preview = screen.getByTestId('briefing-preview');
    expect(preview.textContent).toContain('Data prevista: Data ainda a definir');
  });
});
