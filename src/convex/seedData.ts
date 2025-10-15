import { mutation } from "./_generated/server";

export const seedDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if data already exists
    const existingItems = await ctx.db.query("menuItems").first();
    if (existingItems) {
      return { message: "Database already seeded" };
    }

    // Create admin accounts
    const admins = [
      { canteenId: "food-plaza", username: "foodadmin", password: "12345", canteenName: "Food Plaza" },
      { canteenId: "campus-cafeteria", username: "cafeadmin", password: "12345", canteenName: "Campus Cafeteria" },
      { canteenId: "canteen-3", username: "admin3", password: "12345", canteenName: "Canteen 3" },
      { canteenId: "canteen-4", username: "admin4", password: "12345", canteenName: "Canteen 4" },
      { canteenId: "canteen-5", username: "admin5", password: "12345", canteenName: "Canteen 5" },
    ];

    for (const admin of admins) {
      await ctx.db.insert("canteenAdmins", admin);
    }

    // Sample menu items
    const menuItems = [
      // Food Plaza
      { canteenId: "food-plaza", name: "Paneer Roll", price: 60, category: "Snacks", image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400", description: "Spicy paneer wrapped in soft paratha", available: true },
      { canteenId: "food-plaza", name: "Veg Burger", price: 50, category: "Snacks", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400", description: "Classic veggie burger with cheese", available: true },
      { canteenId: "food-plaza", name: "French Fries", price: 40, category: "Snacks", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400", description: "Crispy golden fries", available: true },
      { canteenId: "food-plaza", name: "Masala Dosa", price: 70, category: "Meals", image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=400", description: "South Indian crispy dosa", available: true },
      { canteenId: "food-plaza", name: "Cold Coffee", price: 50, category: "Beverages", image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400", description: "Chilled coffee with ice cream", available: true },
      
      // Campus Cafeteria
      { canteenId: "campus-cafeteria", name: "Grilled Sandwich", price: 55, category: "Snacks", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400", description: "Healthy grilled veggie sandwich", available: true },
      { canteenId: "campus-cafeteria", name: "Caesar Salad", price: 80, category: "Meals", image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400", description: "Fresh greens with caesar dressing", available: true },
      { canteenId: "campus-cafeteria", name: "Green Tea", price: 30, category: "Beverages", image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400", description: "Refreshing green tea", available: true },
      { canteenId: "campus-cafeteria", name: "Fruit Bowl", price: 60, category: "Snacks", image: "https://images.unsplash.com/photo-1546548970-71785318a17b?w=400", description: "Mixed seasonal fruits", available: true },
      
      // Canteen 3
      { canteenId: "canteen-3", name: "Butter Chicken", price: 120, category: "Meals", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400", description: "Rich and creamy butter chicken", available: true },
      { canteenId: "canteen-3", name: "Dal Makhani", price: 90, category: "Meals", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400", description: "Creamy black lentils", available: true },
      { canteenId: "canteen-3", name: "Naan", price: 20, category: "Snacks", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400", description: "Soft butter naan", available: true },
      { canteenId: "canteen-3", name: "Lassi", price: 40, category: "Beverages", image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400", description: "Sweet yogurt drink", available: true },
      
      // Canteen 4
      { canteenId: "canteen-4", name: "Margherita Pizza", price: 150, category: "Meals", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400", description: "Classic cheese pizza", available: true },
      { canteenId: "canteen-4", name: "Pasta Alfredo", price: 130, category: "Meals", image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400", description: "Creamy white sauce pasta", available: true },
      { canteenId: "canteen-4", name: "Garlic Bread", price: 60, category: "Snacks", image: "https://images.unsplash.com/photo-1573140401552-3fab0b24f2b6?w=400", description: "Toasted garlic bread", available: true },
      { canteenId: "canteen-4", name: "Mojito", price: 50, category: "Beverages", image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400", description: "Refreshing mint mojito", available: true },
      
      // Canteen 5
      { canteenId: "canteen-5", name: "Chocolate Brownie", price: 70, category: "Snacks", image: "https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=400", description: "Warm chocolate brownie", available: true },
      { canteenId: "canteen-5", name: "Ice Cream Sundae", price: 80, category: "Snacks", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400", description: "Delicious ice cream with toppings", available: true },
      { canteenId: "canteen-5", name: "Gulab Jamun", price: 50, category: "Snacks", image: "https://images.unsplash.com/photo-1589119908995-c6c8f7b7c89f?w=400", description: "Traditional Indian sweet", available: true },
      { canteenId: "canteen-5", name: "Milkshake", price: 60, category: "Beverages", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400", description: "Thick and creamy milkshake", available: true },
    ];

    for (const item of menuItems) {
      await ctx.db.insert("menuItems", item);
    }

    return { message: "Database seeded successfully" };
  },
});
