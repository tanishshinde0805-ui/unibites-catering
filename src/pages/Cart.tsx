import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { ArrowLeft, Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const selectedCanteenId = localStorage.getItem("selectedCanteen") || "";
  const canteen = useQuery(api.canteens.getById, { canteenId: selectedCanteenId });
  const createOrder = useMutation(api.orders.create);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
  }, []);

  const updateQuantity = (index: number, delta: number) => {
    const newCart = [...cart];
    newCart[index].quantity += delta;
    if (newCart[index].quantity <= 0) {
      newCart.splice(index, 1);
    }
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const removeItem = (index: number) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    toast.success("Item removed from cart");
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    if (!customerName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsSubmitting(true);
    try {
      await createOrder({
        canteenId: selectedCanteenId,
        customerName: customerName.trim(),
        items: cart.map((item) => ({
          menuItemId: item.menuItemId as Id<"menuItems">,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount,
      });

      localStorage.removeItem("cart");
      localStorage.removeItem("selectedCanteen");
      toast.success("Order placed successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Your Cart</h1>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-16">
        {cart.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-xl text-gray-600 mb-8">Your cart is empty</p>
            <Button onClick={() => navigate("/")}>Browse Canteens</Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-6 border-2 border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          {item.name}
                        </h3>
                        <p className="text-gray-600">₹{item.price} each</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => updateQuantity(index, -1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-bold">
                            {item.quantity}
                          </span>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => updateQuantity(index, 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeItem(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div>
              <Card className="p-8 border-2 border-gray-200 sticky top-8">
                <h3 className="text-xl font-bold tracking-tight text-gray-900 mb-6">
                  Order Summary
                </h3>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <Label htmlFor="name" className="text-gray-900">Your Name</Label>
                    <Input
                      id="name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter your name"
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-gray-900">Canteen</Label>
                    <p className="mt-2 text-gray-600">{canteen?.name || "Loading..."}</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-bold">₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between items-center text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>₹{totalAmount}</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Placing Order..." : "Place Order"}
                </Button>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
