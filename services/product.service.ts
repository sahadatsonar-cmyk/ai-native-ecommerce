import { db } from "@/db";
import { products, productVariants, productImages } from "@/db/schema";
import { eq, isNull, and, desc, asc } from "drizzle-orm";
import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  status: z.enum(["draft", "active", "archived"]).default("draft"),
  storeId: z.string().uuid().optional().nullable(),
  createdBy: z.string().uuid().optional().nullable(),
  seo: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
    })
    .optional(),
  // Initial variant
  price: z.string().or(z.number()),
  compareAtPrice: z.string().or(z.number()).optional().nullable(),
  sku: z.string().optional().nullable(),
});

export const updateProductSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  slug: z.string().min(1).max(200).optional(),
  description: z.string().optional().nullable(),
  shortDescription: z.string().optional().nullable(),
  status: z.enum(["draft", "active", "archived"]).optional(),
  seo: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
    })
    .optional()
    .nullable(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

export async function getProducts(options?: {
  storeId?: string | null;
  status?: "draft" | "active" | "archived";
  limit?: number;
  offset?: number;
}) {
  const conditions = [isNull(products.deletedAt)];

  if (options?.storeId) {
    conditions.push(eq(products.storeId, options.storeId));
  }

  if (options?.status) {
    conditions.push(eq(products.status, options.status));
  }

  const query = db
    .select()
    .from(products)
    .where(and(...conditions))
    .orderBy(desc(products.createdAt))
    .limit(options?.limit ?? 50)
    .offset(options?.offset ?? 0);

  return query;
}

export async function getProductById(id: string) {
  const [product] = await db
    .select()
    .from(products)
    .where(and(eq(products.id, id), isNull(products.deletedAt)))
    .limit(1);

  if (!product) return null;

  const variants = await db
    .select()
    .from(productVariants)
    .where(eq(productVariants.productId, id))
    .orderBy(asc(productVariants.createdAt));

  const images = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, id))
    .orderBy(asc(productImages.position));

  return {
    ...product,
    variants,
    images,
  };
}

export async function getProductBySlug(slug: string, storeId?: string | null) {
  const conditions = [eq(products.slug, slug), isNull(products.deletedAt)];

  if (storeId) {
    conditions.push(eq(products.storeId, storeId));
  }

  const [product] = await db
    .select()
    .from(products)
    .where(and(...conditions))
    .limit(1);

  if (!product) return null;

  const variants = await db
    .select()
    .from(productVariants)
    .where(eq(productVariants.productId, product.id));

  const images = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, product.id))
    .orderBy(asc(productImages.position));

  return {
    ...product,
    variants,
    images,
  };
}

export async function createProduct(input: CreateProductInput) {
  const data = createProductSchema.parse(input);

  const [product] = await db
    .insert(products)
    .values({
      name: data.name,
      slug: data.slug,
      description: data.description,
      shortDescription: data.shortDescription,
      status: data.status ?? "draft",
      storeId: data.storeId,
      createdBy: data.createdBy,
      seo: data.seo,
    })
    .returning();

  // Create default variant
  const [variant] = await db
    .insert(productVariants)
    .values({
      productId: product.id,
      name: "Default",
      sku: data.sku,
      price: String(data.price),
      compareAtPrice: data.compareAtPrice
        ? String(data.compareAtPrice)
        : null,
      status: "active",
    })
    .returning();

  return {
    ...product,
    variants: [variant],
    images: [],
  };
}

export async function updateProduct(id: string, input: UpdateProductInput) {
  const data = updateProductSchema.parse(input);

  const [product] = await db
    .update(products)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(and(eq(products.id, id), isNull(products.deletedAt)))
    .returning();

  return product ?? null;
}

export async function deleteProduct(id: string) {
  const [product] = await db
    .update(products)
    .set({
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(and(eq(products.id, id), isNull(products.deletedAt)))
    .returning();

  return product ?? null;
}
