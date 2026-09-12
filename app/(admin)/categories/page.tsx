import Link from "next/link";
import { actionGetCategories, actionCreateCategory, actionDeleteCategory } from "../products/actions";
import { Badge } from "@/components/ui/badge";
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
import { revalidatePath } from "next/cache";

export default async function AdminCategoriesPage() {
  let categories: Awaited<ReturnType<typeof actionGetCategories>> = [];
  let error: string | null = null;

  try {
    categories = await actionGetCategories();
  } catch (e) {
    console.error(e);
    error = "Failed to load categories. Check database connection.";
  }

  async function handleCreate(formData: FormData) {
    "use server";
    await actionCreateCategory(formData);
    revalidatePath("/admin/categories");
  }

  async function handleDelete(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    if (id) {
      await actionDeleteCategory(id);
      revalidatePath("/admin/categories");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Categories</h1>
        <p className="text-muted-foreground text-sm">
          Organize your products into categories
        </p>
      </div>

      {error && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Create form */}
        <Card>
          <CardHeader>
            <CardTitle>Add Category</CardTitle>
            <CardDescription>Create a new category</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required placeholder="Category name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" name="slug" required placeholder="category-slug" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" name="description" placeholder="Optional" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input id="position" name="position" type="number" defaultValue={0} />
              </div>
              <Button type="submit">Create Category</Button>
            </form>
          </CardContent>
        </Card>

        {/* List */}
        <Card>
          <CardHeader>
            <CardTitle>All Categories</CardTitle>
            <CardDescription>
              {categories.length} categor{categories.length === 1 ? "y" : "ies"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {categories.length === 0 ? (
              <p className="text-sm text-muted-foreground">No categories yet.</p>
            ) : (
              <ul className="space-y-3">
                {categories.map((cat) => (
                  <li
                    key={cat.id}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <div>
                      <p className="font-medium">{cat.name}</p>
                      <p className="text-xs text-muted-foreground">{cat.slug}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={cat.isActive ? "default" : "secondary"}>
                        {cat.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <form action={handleDelete}>
                        <input type="hidden" name="id" value={cat.id} />
                        <Button type="submit" variant="outline" size="sm">
                          Delete
                        </Button>
                      </form>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
