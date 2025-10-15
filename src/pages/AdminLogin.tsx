import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { ArrowLeft, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // We'll use a query to check credentials
      const response = await fetch(`${import.meta.env.VITE_CONVEX_URL}/api/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: "adminAuth:login",
          args: { username, password },
        }),
      });

      const result = await response.json();

      if (result.value) {
        localStorage.setItem("adminSession", JSON.stringify(result.value));
        toast.success("Login successful!");
        navigate("/admin/dashboard");
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
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
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Admin Login</h1>
        </div>
      </nav>

      <div className="flex items-center justify-center py-32 px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="border-2 border-gray-200">
            <CardHeader className="text-center pb-8">
              <div className="text-5xl mb-4">🔐</div>
              <CardTitle className="text-2xl">Canteen Admin</CardTitle>
              <CardDescription>Sign in to manage your canteen</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    required
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    className="mt-2"
                  />
                </div>
                <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                  <LogIn className="h-4 w-4" />
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-2">Demo Credentials:</p>
                <p className="text-xs text-gray-600">foodadmin / 12345</p>
                <p className="text-xs text-gray-600">cafeadmin / 12345</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
