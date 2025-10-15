import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { LogOut, Package, DollarSign, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

interface AdminSession {
  canteenId: string;
  canteenName: string;
  username: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState<AdminSession | null>(null);
  
  useEffect(() => {
    const savedSession = localStorage.getItem("adminSession");
    if (!savedSession) {
      navigate("/admin/login");
      return;
    }
    setSession(JSON.parse(savedSession));
  }, [navigate]);

  const orders = useQuery(
    api.orders.listByCanteen,
    session ? { canteenId: session.canteenId } : "skip"
  );
  
  const stats = useQuery(
    api.orders.getStats,
    session ? { canteenId: session.canteenId } : "skip"
  );

  const updateOrderStatus = useMutation(api.orders.updateStatus);

  const handleLogout = () => {
    localStorage.removeItem("adminSession");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleStatusChange = async (orderId: Id<"orders">, newStatus: string) => {
    try {
      await updateOrderStatus({ id: orderId, status: newStatus });
      toast.success("Order status updated");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "preparing": return "bg-blue-100 text-blue-800";
      case "ready": return "bg-green-100 text-green-800";
      case "delivered": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (!session) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🍽️</div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                {session.canteenName}
              </h1>
              <p className="text-sm text-gray-600">Admin Dashboard</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-8 border-2 border-gray-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <Package className="h-6 w-6 text-gray-900" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.totalOrders || 0}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-8 border-2 border-gray-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-gray-900" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">₹{stats?.totalRevenue || 0}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-8 border-2 border-gray-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-gray-900" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Top Item</p>
                  <p className="text-lg font-bold text-gray-900">
                    {stats?.topItems?.[0]?.name || "N/A"}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Orders List */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">Recent Orders</h2>
          <div className="space-y-4">
            {orders?.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6 border-2 border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          Order #{order.orderNumber}
                        </h3>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-gray-600">Customer: {order.customerName}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order._creationTime).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">₹{order.totalAmount}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-bold text-gray-900 mb-2">Items:</p>
                    <ul className="space-y-1">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="text-sm text-gray-600">
                          {item.quantity}x {item.name} - ₹{item.price * item.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center gap-3">
                    <p className="text-sm text-gray-600">Update Status:</p>
                    <Select
                      value={order.status}
                      onValueChange={(value) => handleStatusChange(order._id, value)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="preparing">Preparing</SelectItem>
                        <SelectItem value="ready">Ready</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </Card>
              </motion.div>
            ))}
            {orders?.length === 0 && (
              <p className="text-center text-gray-600 py-16">No orders yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
