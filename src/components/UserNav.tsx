import Link from "next/link";
import { getSession } from "@/lib/session";
import UserMenu from "./UserMenu";

export default async function UserNav() {
  const session = await getSession();

  if (!session) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/auth/login"
          className="text-sm font-medium text-slate-600 hover:text-navy-900 transition-colors"
        >
          Sign in
        </Link>
        <Link
          href="/auth/register"
          className="px-4 py-2 text-sm font-semibold text-white bg-navy-900 hover:bg-gold-500 hover:text-navy-900 transition-colors"
        >
          Sign up free
        </Link>
      </div>
    );
  }

  return <UserMenu name={session.name} email={session.email} plan={session.plan} />;
}
