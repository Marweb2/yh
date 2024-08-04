import ResetPassword from "@/components/auth/ResetForm";
export default function NewPasswordPage({ params }) {
  const { token } = params;
  return <ResetPassword token={token} />;
}
