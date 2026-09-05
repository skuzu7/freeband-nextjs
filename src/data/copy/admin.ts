// src/data/copy/admin.ts
// /admin — the production login.
export const admin = {
  seo: { title: 'Acesso à produção' },
  brandSub: 'Produções',
  title: 'Acesso à produção',
  passwordLabel: 'Senha',
  submit: 'Entrar',
  submitting: 'Entrando...',
  errors: {
    missing: 'Informe a senha.',
    misconfigured: 'Configuração ausente no servidor (ADMIN_PASSWORD/SESSION_SECRET).',
    tooMany: 'Muitas tentativas. Aguarde alguns minutos.',
    wrong: 'Senha incorreta.',
  },
};
