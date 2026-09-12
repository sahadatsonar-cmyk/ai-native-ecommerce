import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await auth();
  const user = session?.user;
  const isAdmin =
    user &&
    ["super_admin", "admin", "manager", "staff"].includes(user.role);

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl space-y-10">
        <div className="space-y-2 text-center">
          <Badge variant="secondary">Phase 06</Badge>
          <h1 className="text-4xl font-bold tracking-tight">
            AI-Native E-Commerce Platform
          </h1>
          <p className="text-muted-foreground text-lg">
            Core E-Commerce Modules ready
          </p>
        </div>

        <Separator />

        {/* Quick Links for Admin */}
        {isAdmin && (
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle>Admin Panel</CardTitle>
              <CardDescription>
                Manage products, categories and more
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Link
                href="/admin/products"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4"
              >
                Products
              </Link>
              <Link
                href="/admin/categories"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium border bg-background shadow-xs hover:bg-accent h-9 px-4"
              >
                Categories
              </Link>
              <Link
                href="/admin/products/new"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium border bg-background shadow-xs hover:bg-accent h-9 px-4"
              >
                Add Product
              </Link>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Authentication Status</CardTitle>
            <CardDescription>
              {user ? "You are currently signed in" : "You are not signed in"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {user ? (
              <>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-muted-foreground">Name:</span>{" "}
                    {user.name}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Email:</span>{" "}
                    {user.email}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Role:</span>{" "}
                    <Badge variant="outline">{user.role}</Badge>
                  </p>
                </div>
                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/" });
                  }}
                >
                  <Button type="submit" variant="outline">
                    Sign out
                  </Button>
                </form>
              </>
            ) : (
              <div className="flex gap-3">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium border bg-background shadow-xs hover:bg-accent h-9 px-4"
                >
                  Register
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Phase 00 – Blueprint</span>
              <Badge variant="secondary">Done</Badge>
            </div>
            <div className="flex justify-between">
              <span>Phase 01 – System Architecture</span>
              <Badge variant="secondary">Done</Badge>
            </div>
            <div className="flex justify-between">
              <span>Phase 02 – Database Architecture</span>
              <Badge variant="secondary">Done</Badge>
            </div>
            <div className="flex justify-between">
              <span>Phase 03 – Project Initialization</span>
              <Badge variant="secondary">Done</Badge>
            </div>
            <div className="flex justify-between">
              <span>Phase 04 – Design System</span>
              <Badge variant="secondary">Done</Badge>
            </div>
            <div className="flex justify-between">
              <span>Phase 05 – Authentication</span>
              <Badge variant="secondary">Done</Badge>
            </div>
            <div className="flex justify-between">
              <span>Phase 06 – Core E-Commerce</span>
              <Badge>In Progress</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
