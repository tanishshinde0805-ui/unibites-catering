import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { ArrowLeft, Package, Clock, ChefHat, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";

export default function OrderHistory() {
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState<string>("");

  useEffect(() => {
    // Try to get customer name from localStorage (from previous orders)
    const cart = localStorage.getItem("cart");
    const lastOrderName = localStorage.getItem("lastCustomerName");
    if (lastOrderName) {
      setCustomerName(lastOrderName);
    }
  }, []);

  const orders = useQuery(
    api.orders.listByCustomer,
    customerName ? { customerName } : "skip"
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "preparing":
        return "bg-blue-100 text-blue-800";
      case "ready":
        return "bg-green-100 text-green-800";
      case "delivered":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return Package;
      case "preparing":
        return ChefHat;
      case "ready":
        return Clock;
      case "delivered":
        return CheckCircle;
      default:
        return Package;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            My Orders
          </h1>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-16">
        {!customerName ? (
          <div className="text-center py-32">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-4">
              No order history found
            </p>
            <p className="text-gray-500 mb-8">
              Place an order to see your order history
            </p>
            <Button onClick={() => navigate("/")}>Browse Canteens</Button>
          </div>
        ) : orders === undefined ? (
          <div className="text-center py-32">
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        ) : orders === null || orders.length === 0 ? (
          <div className="text-center py-32">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-4">No orders yet</p>
            <p className="text-gray-500 mb-8">
              Start ordering from your favorite canteens
            </p>
            <Button onClick={() => navigate("/")}>Browse Canteens</Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="mb-8">
              <h2 className="text-lg text-gray-600">
                Showing orders for: <span className="font-bold text-gray-900">{customerName}</span>
              </h2>
            </div>

            {orders.map((order, index) => {
              const StatusIcon = getStatusIcon(order.status);
              
              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className="p-6 border-2 border-gray-200 hover:border-gray-900 transition-colors cursor-pointer"
                    onClick={() => navigate(`/track/${order._id}`)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-gray-100 rounded-lg">
                          <StatusIcon className="h-6 w-6 text-gray-900" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">
                              Order #{order.orderNumber}
                            </h3>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            {new Date(order._creationTime).toLocaleDateString()} at{" "}
                            {new Date(order._creationTime).toLocaleTimeString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">Total</p>
                        <p className="text-2xl font-bold text-gray-900">
                          ₹{order.totalAmount}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-sm text-gray-600 mb-2">Items:</p>
                      <div className="space-y-1">
                        {order.items.slice(0, 3).map((item, idx) => (
                          <p key={idx} className="text-sm text-gray-900">
                            {item.quantity}x {item.name}
                          </p>
                        ))}
                        {order.items.length > 3 && (
                          <p className="text-sm text-gray-500">
                            +{order.items.length - 3} more item
                            {order.items.length - 3 !== 1 ? "s" : ""}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <Button variant="outline" className="w-full" size="sm">
                        Track Order →
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
