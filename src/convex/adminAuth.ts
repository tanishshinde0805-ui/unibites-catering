import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const login = query({
  args: {
    username: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const admin = await ctx.db
      .query("canteenAdmins")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();

    if (!admin || admin.password !== args.password) {
      return null;
    }

    return {
      canteenId: admin.canteenId,
      canteenName: admin.canteenName,
      username: admin.username,
    };
  },
});

export const createAdmin = mutation({
  args: {
    canteenId: v.string(),
    username: v.string(),
    password: v.string(),
    canteenName: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("canteenAdmins", args);
  },
});
