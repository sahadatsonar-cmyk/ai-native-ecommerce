"use server";

import { revalidatePath } from "next/cache";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductById,
  createProductSchema,
  updateProductSchema,
} from "@/services/product.service";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
  createCategorySchema,
  updateCategorySchema,
} from "@/services/category.service";
import { requireAuth } from "@/lib/auth-helpers";

// ============ PRODUCTS ============

export async function actionGetProducts() {
  await requireAuth();
  return getProducts({ limit: 100 });
}

export async function actionGetProduct(id: string) {
  await requireAuth();
  return getProductById(id);
}

export async function actionCreateProduct(formData: FormData) {
  const user = await requireAuth();

  const raw = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    description: (formData.get("description") as string) || undefined,
    shortDescription: (formData.get("shortDescription") as string) || undefined,
    status: (formData.get("status") as "draft" | "active" | "archived") || "draft",
    price: formData.get("price") as string,
    compareAtPrice: (formData.get("compareAtPrice") as string) || undefined,
    sku: (formData.get("sku") as string) || undefined,
    createdBy: user.id,
  };

  const parsed = createProductSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  try {
    const product = await createProduct(parsed.data);
    revalidatePath("/admin/products");
    return { success: true, product };
  } catch (e) {
    console.error(e);
    return { error: "Failed to create product" };
  }
}

export async function actionUpdateProduct(id: string, formData: FormData) {
  await requireAuth();

  const raw = {
    name: (formData.get("name") as string) || undefined,
    slug: (formData.get("slug") as string) || undefined,
    description: (formData.get("description") as string) || undefined,
    shortDescription: (formData.get("shortDescription") as string) || undefined,
    status: (formData.get("status") as "draft" | "active" | "archived") || undefined,
  };

  const parsed = updateProductSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  try {
    const product = await updateProduct(id, parsed.data);
    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}`);
    return { success: true, product };
  } catch (e) {
    console.error(e);
    return { error: "Failed to update product" };
  }
}

export async function actionDeleteProduct(id: string) {
  await requireAuth();

  try {
    await deleteProduct(id);
    revalidatePath("/admin/products");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Failed to delete product" };
  }
}

// ============ CATEGORIES ============

export async function actionGetCategories() {
  await requireAuth();
  return getCategories();
}

export async function actionCreateCategory(formData: FormData) {
  await requireAuth();

  const raw = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    description: (formData.get("description") as string) || undefined,
    position: Number(formData.get("position") || 0),
    isActive: formData.get("isActive") !== "false",
  };

  const parsed = createCategorySchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  try {
    const category = await createCategory(parsed.data);
    revalidatePath("/admin/categories");
    return { success: true, category };
  } catch (e) {
    console.error(e);
    return { error: "Failed to create category" };
  }
}

export async function actionUpdateCategory(id: string, formData: FormData) {
  await requireAuth();

  const raw = {
    name: (formData.get("name") as string) || undefined,
    slug: (formData.get("slug") as string) || undefined,
    description: (formData.get("description") as string) || undefined,
    position: formData.get("position")
      ? Number(formData.get("position"))
      : undefined,
    isActive:
      formData.get("isActive") !== null
        ? formData.get("isActive") !== "false"
        : undefined,
  };

  const parsed = updateCategorySchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  try {
    const category = await updateCategory(id, parsed.data);
    revalidatePath("/admin/categories");
    return { success: true, category };
  } catch (e) {
    console.error(e);
    return { error: "Failed to update category" };
  }
}

export async function actionDeleteCategory(id: string) {
  await requireAuth();

  try {
    await deleteCategory(id);
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Failed to delete category" };
  }
}
