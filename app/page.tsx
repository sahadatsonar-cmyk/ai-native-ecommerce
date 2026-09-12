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

export default async function HomePage() {
  const session = await auth();
  const user = session?.user;

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl space-y-10">
        <div className="space-y-2 text-center">
          <Badge variant="secondary">Phase 05</Badge>
          <h1 className="text-4xl font-bold tracking-tight">
            AI-Native E-Commerce Platform
          </h1>
          <p className="text-muted-foreground text-lg">
            Authentication & Authorization ready
          </p>
        </div>

        <Separator />

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
                  <p>
                    <span className="text-muted-foreground">Permissions:</span>{" "}
                    {user.permissions.length > 0
                      ? user.permissions.join(", ")
                      : "None"}
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
                <Button asChild>
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/register">Register</Link>
                </Button>
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
              <span>Phase 05 – Authentication & Authorization</span>
              <Badge>In Progress</Badge>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Next: Phase 06 — Core E-Commerce Modules
        </p>
      </div>
    </main>
  );
}
