import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // Canteen admins
    canteenAdmins: defineTable({
      canteenId: v.string(),
      username: v.string(),
      password: v.string(), // In production, this should be hashed
      canteenName: v.string(),
    })
      .index("by_username", ["username"])
      .index("by_canteen", ["canteenId"]),

    // Menu items
    menuItems: defineTable({
      canteenId: v.string(),
      name: v.string(),
      price: v.number(),
      category: v.string(), // "Snacks", "Meals", "Beverages"
      image: v.string(),
      description: v.optional(v.string()),
      available: v.boolean(),
    })
      .index("by_canteen", ["canteenId"])
      .index("by_canteen_and_category", ["canteenId", "category"]),

    // Orders
    orders: defineTable({
      canteenId: v.string(),
      customerName: v.string(),
      items: v.array(
        v.object({
          menuItemId: v.id("menuItems"),
          name: v.string(),
          price: v.number(),
          quantity: v.number(),
        })
      ),
      totalAmount: v.number(),
      status: v.string(), // "pending", "preparing", "ready", "delivered"
      orderNumber: v.string(),
    })
      .index("by_canteen", ["canteenId"])
      .index("by_status", ["status"])
      .index("by_canteen_and_status", ["canteenId", "status"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;