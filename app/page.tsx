import AuthForm from "@/components/auth/AuthForm";

export default function Home() {
  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-12">
          <AuthForm type="sign-in" />

    </main>
  );
}
