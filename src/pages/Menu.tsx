import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, ShoppingCart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";

interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export default function Menu() {
  const { canteenId } = useParams<{ canteenId: string }>();
  const navigate = useNavigate();
  const canteen = useQuery(api.canteens.getById, { canteenId: canteenId || "" });
  const menuItems = useQuery(api.menuItems.list, { canteenId: canteenId || "" });
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Snacks", "Meals", "Beverages"];

  const filteredItems = menuItems?.filter(
    (item) => selectedCategory === "All" || item.category === selectedCategory
  );

  const addToCart = (item: NonNullable<typeof menuItems>[0]) => {
    if (!item) return;
    
    const cart = JSON.parse(localStorage.getItem("cart") || "[]") as CartItem[];
    const existingItem = cart.find((i) => i.menuItemId === item._id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        menuItemId: item._id,
        name: item.name,
        price: item.price,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("selectedCanteen", canteenId || "");
    toast.success(`${item.name} added to cart`);
  };

  if (!canteen) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              {canteen.name}
            </h1>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate("/cart")}
            className="gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            Cart
          </Button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Category Filter */}
        <div className="flex gap-3 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems?.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="overflow-hidden border-2 border-gray-200 hover:border-gray-900 transition-colors">
                <div className="aspect-video w-full overflow-hidden bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold tracking-tight text-gray-900">
                      {item.name}
                    </h3>
                    <Badge variant="secondary">{item.category}</Badge>
                  </div>
                  {item.description && (
                    <p className="text-gray-600 mb-4 text-sm">{item.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">₹{item.price}</span>
                    <Button
                      size="sm"
                      onClick={() => addToCart(item)}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
