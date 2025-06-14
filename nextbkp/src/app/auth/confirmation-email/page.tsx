import { Suspense } from "react";
import { ConfirmEmailContent } from "./components/confirm-email-content";

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={<div>Verificando...</div>}>
      <ConfirmEmailContent />
    </Suspense>
  );
}
