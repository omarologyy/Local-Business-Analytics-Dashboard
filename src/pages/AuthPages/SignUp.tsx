import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../components/auth/SignUpForm";

export default function SignUp() {
  return (
    <>
      <PageMeta
        title="UmarNova"
        description="A business dashboard that aggregates sales, customer retention, and market trends."
      />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
