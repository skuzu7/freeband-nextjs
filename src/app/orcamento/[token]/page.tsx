import { redirect } from "next/navigation";
import { validateToken } from "@/lib/token";
import { OrcamentoPage } from "@/components/orcamento/OrcamentoPage";

interface Props {
  params: Promise<{ token: string }>;
}

export default async function OrcamentoRoute({ params }: Props) {
  const { token } = await params;

  if (!validateToken(token)) {
    redirect("/");
  }

  return <OrcamentoPage />;
}
