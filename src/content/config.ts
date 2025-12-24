import { defineCollection, z } from 'astro:content';

const productsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    price: z.number(),
    category: z.string(),
    featured: z.boolean().default(false),
    available: z.boolean().default(true),
    images: z.array(z.string()),
    materials: z.array(z.string()),
    dimensions: z.object({
      height: z.string(),
      width: z.string(),
    }),
    customizable: z.boolean().default(false),
    createdAt: z.string(),
  }),
});

export const collections = {
  products: productsCollection,
};
