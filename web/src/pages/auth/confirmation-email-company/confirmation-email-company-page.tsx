import { Suspense } from "react";
import { ConfirmEmailContent } from "./components/confirm-email-content";

export function ConfirmEmailCompanyPage() {
  return (
    <Suspense fallback={<div>Verificando...</div>}>
      <ConfirmEmailContent />
    </Suspense>
  );
}
