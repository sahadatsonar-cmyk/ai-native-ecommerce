import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role = session.user.role;
  if (!["super_admin", "admin", "manager", "staff"].includes(role)) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link href="/admin/products" className="font-semibold">
              Admin
            </Link>
            <nav className="flex gap-4 text-sm text-muted-foreground">
              <Link href="/admin/products" className="hover:text-foreground">
                Products
              </Link>
              <Link href="/admin/categories" className="hover:text-foreground">
                Categories
              </Link>
              <Link href="/" className="hover:text-foreground">
                Storefront
              </Link>
            </nav>
          </div>
          <div className="text-sm text-muted-foreground">
            {session.user.name || session.user.email} ({session.user.role})
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-4">{children}</main>
    </div>
  );
}
