// Token-less quote-builder route. Access control lives in src/proxy.ts:
// a signed session cookie (from /admin login or a legacy token link) is
// required to reach this page at all.
import type { Metadata } from "next";
import { OrcamentoPage } from "@/components/orcamento/OrcamentoPage";
import { logoutAction } from "../admin/actions";

export const metadata: Metadata = {
  title: "Gerador de proposta — Internacional Freeband",
};

export default function OrcamentoRoute() {
  return <OrcamentoPage onLogout={logoutAction} />;
}
