import { actionCreateProduct } from "../actions";
import { redirect } from "next/navigation";
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
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function NewProductPage() {
  async function handleCreate(formData: FormData) {
    "use server";
    const result = await actionCreateProduct(formData);
    if (result.success) {
      redirect("/admin/products");
    }
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
        <h1 className="mt-2 text-2xl font-bold">Add Product</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product details</CardTitle>
          <CardDescription>Create a new product with a default variant</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required placeholder="Product name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" name="slug" required placeholder="product-name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shortDescription">Short description</Label>
              <Input id="shortDescription" name="shortDescription" placeholder="Brief summary" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                rows={4}
                className="border-input bg-transparent w-full rounded-md border px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                placeholder="Full product description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input id="price" name="price" type="number" step="0.01" required placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="compareAtPrice">Compare at price</Label>
                <Input id="compareAtPrice" name="compareAtPrice" type="number" step="0.01" placeholder="0.00" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" name="sku" placeholder="SKU-001" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                defaultValue="draft"
                className="border-input bg-transparent w-full rounded-md border px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit">Create Product</Button>
              <Link
                href="/admin/products"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium border bg-background shadow-xs hover:bg-accent h-9 px-4"
              >
                Cancel
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
