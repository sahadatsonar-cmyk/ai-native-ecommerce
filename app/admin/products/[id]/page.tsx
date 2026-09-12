import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { actionGetProduct, actionUpdateProduct, actionDeleteProduct } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await actionGetProduct(id);

  if (!product) {
    notFound();
  }

  async function handleUpdate(formData: FormData) {
    "use server";
    const result = await actionUpdateProduct(id, formData);
    if (result.success) {
      redirect("/admin/products");
    }
  }

  async function handleDelete() {
    "use server";
    await actionDeleteProduct(id);
    redirect("/admin/products");
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <Link
          href="/admin/products"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to products
        </Link>
        <div className="mt-2 flex items-center gap-3">
          <h1 className="text-2xl font-bold">Edit Product</h1>
          <Badge variant={product.status === "active" ? "default" : "secondary"}>
            {product.status}
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{product.name}</CardTitle>
          <CardDescription>Update product details</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required defaultValue={product.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" name="slug" required defaultValue={product.slug} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shortDescription">Short description</Label>
              <Input
                id="shortDescription"
                name="shortDescription"
                defaultValue={product.shortDescription ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                rows={4}
                defaultValue={product.description ?? ""}
                className="border-input bg-transparent w-full rounded-md border px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                defaultValue={product.status}
                className="border-input bg-transparent w-full rounded-md border px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            {product.variants && product.variants.length > 0 && (
              <div className="rounded-md border p-3 text-sm">
                <p className="font-medium mb-1">Variants</p>
                {product.variants.map((v) => (
                  <p key={v.id} className="text-muted-foreground">
                    {v.name || "Default"} — ৳{v.price}
                    {v.sku ? ` (SKU: ${v.sku})` : ""}
                  </p>
                ))}
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <Button type="submit">Save Changes</Button>
              <Link
                href="/admin/products"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium border bg-background shadow-xs hover:bg-accent h-9 px-4"
              >
                Cancel
              </Link>
            </div>
          </form>
          <form action={handleDelete} className="mt-6 border-t pt-4">
            <Button type="submit" variant="destructive">
              Delete Product
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
