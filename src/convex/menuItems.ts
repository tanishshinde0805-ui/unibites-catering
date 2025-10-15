import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: { canteenId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("menuItems")
      .withIndex("by_canteen", (q) => q.eq("canteenId", args.canteenId))
      .filter((q) => q.eq(q.field("available"), true))
      .collect();
  },
});

export const listByCategory = query({
  args: { canteenId: v.string(), category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("menuItems")
      .withIndex("by_canteen_and_category", (q) =>
        q.eq("canteenId", args.canteenId).eq("category", args.category)
      )
      .filter((q) => q.eq(q.field("available"), true))
      .collect();
  },
});

export const getById = query({
  args: { id: v.id("menuItems") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    canteenId: v.string(),
    name: v.string(),
    price: v.number(),
    category: v.string(),
    image: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("menuItems", {
      ...args,
      available: true,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("menuItems"),
    name: v.optional(v.string()),
    price: v.optional(v.number()),
    category: v.optional(v.string()),
    image: v.optional(v.string()),
    description: v.optional(v.string()),
    available: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("menuItems") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
