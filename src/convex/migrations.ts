import { mutation } from "./_generated/server";

export const removeCanteens3And5 = mutation({
  args: {},
  handler: async (ctx) => {
    const canteensToRemove = ["canteen-3", "canteen-5"];

    for (const canteenId of canteensToRemove) {
      // Delete menu items
      const menuItems = await ctx.db
        .query("menuItems")
        .withIndex("by_canteen", (q) => q.eq("canteenId", canteenId))
        .collect();
      
      for (const item of menuItems) {
        await ctx.db.delete(item._id);
      }

      // Delete orders
      const orders = await ctx.db
        .query("orders")
        .withIndex("by_canteen", (q) => q.eq("canteenId", canteenId))
        .collect();

      for (const order of orders) {
        await ctx.db.delete(order._id);
      }

      // Delete admins
      const admins = await ctx.db
        .query("canteenAdmins")
        .withIndex("by_canteen", (q) => q.eq("canteenId", canteenId))
        .collect();
      
      for (const admin of admins) {
        await ctx.db.delete(admin._id);
      }
    }
    
    return "Cleanup complete";
  },
});
