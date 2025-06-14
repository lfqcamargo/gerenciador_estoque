import { createBrowserRouter } from "react-router-dom";
import { SignInPage } from "./pages/auth/sign-in/sign-in-page";
import { AuthLayout } from "./pages/_layouts/auth-layout";
import { SignUpPage } from "./pages/auth/sign-up/sign-up-page";
import { ConfirmEmailCompanyPage } from "./pages/auth/confirmation-email-company/confirmation-email-company-page";
import ConfirmationEmailUserPage from "./pages/auth/confirmation-email-user/confirmation-email-user-page";
import ForgotPasswordPage from "./pages/auth/forgot-password/forgot-password-page";
import ResetPasswordPage from "./pages/auth/reset-password/reset-password-page";
import { AppLayout } from "./pages/_layouts/app-layout";
import DashboardPage from "./pages/app/dashboard/dashbaord-page";

export const routes = createBrowserRouter([
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "sign-in",
        element: <SignInPage />,
      },
      {
        path: "sign-up",
        element: <SignUpPage />,
      },
      {
        path: "confirmation-email-company",
        element: <ConfirmEmailCompanyPage />,
      },
      {
        path: "confirmation-email-user",
        element: <ConfirmationEmailUserPage />,
      },
      {
        path: "forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "reset-password",
        element: <ResetPasswordPage />,
      },
    ],
  },
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
    ],
  },
]);
