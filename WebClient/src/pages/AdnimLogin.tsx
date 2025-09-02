import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { loginAdmin } from "@/api/auth";
import { toast } from "react-toastify";
import { useAuth } from "@/auth/AuthContex";

export default function AdminLogin() {
  const [form, setForm] = useState({ user_id: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await loginAdmin(form);
      console.log("Login response:", response);
      const { access_token, user } = response.data;

      login(access_token, user, "admin");

      toast.success("Login successful!");
      window.location.href = "/su";
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Login failed. Try again.";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black flex items-center justify-center relative overflow-hidden">
      {/* Floating shapes */}
      <motion.div
        className="absolute w-96 h-96 bg-purple-600 opacity-20 blur-3xl rounded-full top-[-100px] left-[-100px]"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      <motion.div
        className="absolute w-72 h-72 bg-indigo-400 opacity-10 blur-2xl rounded-full bottom-[-60px] right-[-60px]"
        animate={{ scale: [1, 0.9, 1] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      {/* Login Card */}
      <motion.div
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 w-full max-w-md text-white shadow-2xl z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="user_id" className="block text-sm font-medium">
              Admin ID
            </label>
            <input
              id="user_id"
              name="user_id"
              type="text"
              required
              value={form.user_id}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <div className="relative mt-1">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-2 pr-10 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-2.5 right-3 text-gray-300 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2"
          >
            Login
          </Button>
        </form>
        <p className="text-center text-sm text-gray-400 mt-6">
          Powered by{" "}
          <span className="font-semibold text-purple-300">Present X</span>
        </p>
      </motion.div>
    </div>
  );
}
