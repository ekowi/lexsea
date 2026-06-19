import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthForm from "@/components/AuthForm";

export const metadata = {
  title: "Create Account | LexSEA",
};

export default async function RegisterPage() {
  const session = await getSession();
  if (session) redirect("/account");

  return (
    <>
      <Header />
      <main className="flex-1 bg-parchment py-16 px-4 flex justify-center">
        <AuthForm mode="register" redirectTo="/" />
      </main>
      <Footer />
    </>
  );
}
