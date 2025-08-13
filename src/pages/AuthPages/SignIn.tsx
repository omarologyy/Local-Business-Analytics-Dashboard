import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="UmarNova"
        description="A business dashboard that aggregates sales, customer retention, and market trends."
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
