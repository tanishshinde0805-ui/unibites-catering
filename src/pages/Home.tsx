import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useNavigate } from "react-router";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  const canteens = useQuery(api.canteens.list);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="text-3xl">🍽️</div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">UniBites</h1>
          </motion.div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => navigate("/orders")}
            >
              My Orders
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/cart")}
              className="gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              Cart
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-8 py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-6xl font-bold tracking-tight text-gray-900 mb-6">
              Smart Food Ordering for Smart Campus
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              Order from all five campus canteens in one place. Fresh food, fast delivery, zero hassle.
            </p>
            <div className="relative w-full h-80 rounded-2xl overflow-hidden mb-12">
              <img
                src="https://images.unsplash.com/photo-1567521464027-f127ff144326?w=1200"
                alt="Campus Cafeteria"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Canteens Grid */}
      <section className="max-w-7xl mx-auto px-8 py-32">
        <motion.h3
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-4xl font-bold tracking-tight text-gray-900 mb-16 text-center"
        >
          Choose Your Canteen
        </motion.h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {canteens?.map((canteen, index) => (
            <motion.div
              key={canteen.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className="p-8 hover:shadow-lg transition-shadow cursor-pointer border-2 border-gray-200 hover:border-gray-900"
                onClick={() => navigate(`/menu/${canteen.id}`)}
              >
                <div className="text-6xl mb-6">{canteen.icon}</div>
                <h4 className="text-2xl font-bold tracking-tight text-gray-900 mb-3">
                  {canteen.name}
                </h4>
                <p className="text-gray-600 mb-6">{canteen.description}</p>
                <Button variant="outline" className="w-full gap-2">
                  View Menu
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Admin Login Link */}
      <section className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8 py-16 text-center">
          <p className="text-gray-600 mb-4">Are you a canteen administrator?</p>
          <Button
            variant="outline"
            onClick={() => navigate("/admin/login")}
          >
            Admin Login
          </Button>
        </div>
      </section>
    </div>
  );
}