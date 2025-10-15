import { v } from "convex/values";
import { query } from "./_generated/server";

export const CANTEENS = [
  {
    id: "food-plaza",
    name: "Food Plaza",
    description: "Your favorite street food and quick bites",
    color: "bg-orange-500",
    icon: "🍔",
    image: "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800",
  },
  {
    id: "campus-cafeteria",
    name: "Campus Cafeteria",
    description: "Healthy meals and fresh beverages",
    color: "bg-green-500",
    icon: "☕",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
  },
  {
    id: "canteen-3",
    name: "Canteen 3",
    description: "Traditional Indian cuisine",
    color: "bg-red-500",
    icon: "🍛",
    image: "https://images.unsplash.com/photo-1590080875831-79c4f3a7e8f5?w=800",
  },
  {
    id: "canteen-4",
    name: "Canteen 4",
    description: "Pizza, pasta, and continental",
    color: "bg-yellow-500",
    icon: "🍕",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
  },
  {
    id: "canteen-5",
    name: "Canteen 5",
    description: "Desserts and sweet treats",
    color: "bg-blue-500",
    icon: "🍩",
    image: "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?w=800",
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