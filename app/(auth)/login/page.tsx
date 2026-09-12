import { LoginForm } from "@/features/auth/components/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sign in</CardTitle>
          <CardDescription>
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="underline underline-offset-4 hover:text-primary">
              Register
            </Link>
          </p>
          <div className="mt-6 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
            <p className="font-medium mb-1">Demo Accounts:</p>
            <p>Admin → admin@example.com / admin123</p>
            <p>Customer → customer@example.com / customer123</p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
