import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthForm from "@/components/AuthForm";

export const metadata = {
  title: "Sign In | LexSEA",
};

export default async function LoginPage({
  searchParams,
}: Readonly<{ searchParams: Promise<{ from?: string }> }>) {
  const session = await getSession();
  if (session) redirect("/account");

  const params = await searchParams;
  const redirectTo = params.from ?? "/";

  return (
    <>
      <Header />
      <main className="flex-1 bg-parchment py-16 px-4 flex justify-center">
        <AuthForm mode="login" redirectTo={redirectTo} />
      </main>
      <Footer />
    </>
  );
}
