import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq, isNull, and, asc } from "drizzle-orm";
import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  description: z.string().optional(),
  parentId: z.string().uuid().optional().nullable(),
  image: z.string().url().optional().nullable(),
  position: z.number().int().default(0),
  isActive: z.boolean().default(true),
  storeId: z.string().uuid().optional().nullable(),
});

export const updateCategorySchema = createCategorySchema.partial();

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

export async function getCategories(storeId?: string | null) {
  const conditions = [isNull(categories.deletedAt)];

  if (storeId) {
    conditions.push(eq(categories.storeId, storeId));
  }

  return db
    .select()
    .from(categories)
    .where(and(...conditions))
    .orderBy(asc(categories.position), asc(categories.name));
}

export async function getCategoryById(id: string) {
  const [category] = await db
    .select()
    .from(categories)
    .where(and(eq(categories.id, id), isNull(categories.deletedAt)))
    .limit(1);

  return category ?? null;
}

export async function getCategoryBySlug(slug: string, storeId?: string | null) {
  const conditions = [
    eq(categories.slug, slug),
    isNull(categories.deletedAt),
  ];

  if (storeId) {
    conditions.push(eq(categories.storeId, storeId));
  }

  const [category] = await db
    .select()
    .from(categories)
    .where(and(...conditions))
    .limit(1);

  return category ?? null;
}

export async function createCategory(input: CreateCategoryInput) {
  const data = createCategorySchema.parse(input);

  const [category] = await db
    .insert(categories)
    .values({
      name: data.name,
      slug: data.slug,
      description: data.description,
      parentId: data.parentId,
      image: data.image,
      position: data.position ?? 0,
      isActive: data.isActive ?? true,
      storeId: data.storeId,
    })
    .returning();

  return category;
}

export async function updateCategory(id: string, input: UpdateCategoryInput) {
  const data = updateCategorySchema.parse(input);

  const [category] = await db
    .update(categories)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(and(eq(categories.id, id), isNull(categories.deletedAt)))
    .returning();

  return category ?? null;
}

export async function deleteCategory(id: string) {
  const [category] = await db
    .update(categories)
    .set({
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(and(eq(categories.id, id), isNull(categories.deletedAt)))
    .returning();

  return category ?? null;
}
