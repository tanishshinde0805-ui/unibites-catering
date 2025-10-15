import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Package, Clock, ChefHat, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useEffect, useState } from "react";

const statusSteps = [
  { key: "pending", label: "Order Placed", icon: Package, color: "text-yellow-600" },
  { key: "preparing", label: "Preparing", icon: ChefHat, color: "text-blue-600" },
  { key: "ready", label: "Ready for Pickup", icon: Clock, color: "text-green-600" },
  { key: "delivered", label: "Delivered", icon: CheckCircle, color: "text-gray-600" },
];

export default function OrderTracking() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [pollingKey, setPollingKey] = useState(0);

  const order = useQuery(
    api.orders.getById,
    orderId ? { id: orderId as Id<"orders"> } : "skip"
  );

  // Poll every 5 seconds for live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPollingKey((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!orderId) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Invalid order ID</p>
      </div>
    );
  }

  if (order === undefined) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Loading order...</p>
      </div>
    );
  }

  if (order === null) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Order not found</p>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  const currentStepIndex = statusSteps.findIndex((step) => step.key === order.status);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Track Order</h1>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-16">
        {/* Order Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Card className="p-8 border-2 border-gray-200">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
                  Order #{order.orderNumber}
                </h2>
                <p className="text-gray-600">Customer: {order.customerName}</p>
                <p className="text-sm text-gray-500">
                  Placed on {new Date(order._creationTime).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                <p className="text-3xl font-bold text-gray-900">₹{order.totalAmount}</p>
              </div>
            </div>

            {/* Status Progress */}
            <div className="relative">
              <div className="flex justify-between mb-8">
                {statusSteps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;

                  return (
                    <div key={step.key} className="flex flex-col items-center flex-1">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
                          isCompleted
                            ? "bg-gray-900 text-white"
                            : "bg-gray-100 text-gray-400"
                        } ${isCurrent ? "ring-4 ring-gray-300" : ""}`}
                      >
                        <StepIcon className="h-8 w-8" />
                      </motion.div>
                      <p
                        className={`text-sm text-center font-medium ${
                          isCompleted ? "text-gray-900" : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Progress Line */}
              <div className="absolute top-8 left-0 right-0 h-1 bg-gray-200 -z-10">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{
                    width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%`,
                  }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gray-900"
                />
              </div>
            </div>

            {/* Current Status Badge */}
            <div className="mt-8 flex justify-center">
              <Badge className="text-lg px-6 py-2 bg-gray-900 text-white">
                {statusSteps[currentStepIndex]?.label || order.status}
              </Badge>
            </div>
          </Card>
        </motion.div>

        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">
            Order Items
          </h3>
          <Card className="p-6 border-2 border-gray-200">
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">₹{item.price} each</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600">Qty: {item.quantity}</p>
                    <p className="font-bold text-gray-900">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Auto-refresh indicator */}
        <p className="text-center text-sm text-gray-500 mt-8">
          Status updates automatically every 5 seconds
        </p>
      </div>
    </div>
  );
}
