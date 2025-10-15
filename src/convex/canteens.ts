import { v } from "convex/values";
import { query } from "./_generated/server";

export const CANTEENS = [
  {
    id: "food-plaza",
    name: "Food Plaza",
    description: "Your favorite street food and quick bites",
    color: "bg-orange-500",
    icon: "🍔",
  },
  {
    id: "campus-cafeteria",
    name: "Campus Cafeteria",
    description: "Healthy meals and fresh beverages",
    color: "bg-green-500",
    icon: "☕",
  },
  {
    id: "canteen-3",
    name: "Canteen 3",
    description: "Traditional Indian cuisine",
    color: "bg-red-500",
    icon: "🍛",
  },
  {
    id: "canteen-4",
    name: "Canteen 4",
    description: "Pizza, pasta, and continental",
    color: "bg-yellow-500",
    icon: "🍕",
  },
  {
    id: "canteen-5",
    name: "Canteen 5",
    description: "Desserts and sweet treats",
    color: "bg-blue-500",
    icon: "🍩",
  },
];

export const list = query({
  args: {},
  handler: async () => {
    return CANTEENS;
  },
});

export const getById = query({
  args: { canteenId: v.string() },
  handler: async (ctx, args) => {
    return CANTEENS.find((c) => c.id === args.canteenId) || null;
  },
});
