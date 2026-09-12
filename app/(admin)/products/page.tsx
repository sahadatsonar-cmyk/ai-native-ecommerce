import Link from "next/link";
import { actionGetProducts } from "./actions";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function AdminProductsPage() {
  let products: Awaited<ReturnType<typeof actionGetProducts>> = [];
  let error: string | null = null;

  try {
    products = await actionGetProducts();
  } catch (e) {
    console.error(e);
    error = "Failed to load products. Check database connection.";
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground text-sm">
            Manage your product catalog
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4"
        >
          Add Product
        </Link>
      </div>

      {error && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {!error && products.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>No products yet</CardTitle>
            <CardDescription>
              Create your first product to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/admin/products/new"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4"
            >
              Add Product
            </Link>
          </CardContent>
        </Card>
      )}

      {products.length > 0 && (
        <div className="rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left">
                <th className="p-3 font-medium">Name</th>
                <th className="p-3 font-medium">Slug</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium">Created</th>
                <th className="p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b last:border-0">
                  <td className="p-3 font-medium">{product.name}</td>
                  <td className="p-3 text-muted-foreground">{product.slug}</td>
                  <td className="p-3">
                    <Badge
                      variant={
                        product.status === "active"
                          ? "default"
                          : product.status === "draft"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {product.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {product.createdAt
                      ? new Date(product.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="p-3">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="text-sm underline underline-offset-4 hover:text-primary"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
