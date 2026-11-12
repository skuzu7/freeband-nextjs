import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BriefingBuilder } from '../BriefingBuilder';

describe('BriefingBuilder', () => {
  it('updates the live message preview and WhatsApp link when format, package, date and city change', () => {
    render(<BriefingBuilder />);

    const formatBtn = screen.getByRole('button', { name: 'Formatura' });
    fireEvent.click(formatBtn);
    expect(formatBtn).toHaveAttribute('aria-pressed', 'true');

    const pkgBtn = screen.getByRole('button', { name: /Show Essencial/i });
    fireEvent.click(pkgBtn);
    expect(pkgBtn).toHaveAttribute('aria-pressed', 'true');

    const dateInput = screen.getByLabelText(/Data ou mês previsto/i);
    fireEvent.change(dateInput, { target: { value: 'Novembro/2026' } });

    const cityInput = screen.getByLabelText(/Cidade \/ UF/i);
    fireEvent.change(cityInput, { target: { value: 'Jaú/SP' } });

    const preview = screen.getByTestId('briefing-preview');
    expect(preview.textContent).toContain('Formato: Formatura');
    expect(preview.textContent).toContain('Estrutura: Show Essencial');
    expect(preview.textContent).toContain('Data prevista: Novembro/2026');
    expect(preview.textContent).toContain('Cidade/UF: Jaú/SP');

    const cta = screen.getByRole('link', { name: /Enviar briefing pelo WhatsApp/i });
    const href = cta.getAttribute('href') ?? '';
    expect(href).toContain('https://wa.me/5516997732749?text=');
    expect(decodeURIComponent(href)).toContain('Formatura');
    expect(decodeURIComponent(href)).toContain('Show Essencial');
    expect(decodeURIComponent(href)).toContain('Novembro/2026');
    expect(decodeURIComponent(href)).toContain('Jaú/SP');
  });
});
