import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { loginLecturer } from "@/api/auth";
import { useAuth } from "@/auth/AuthContex";

export default function LecturerLogin() {
  const [form, setForm] = useState({ user_id: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const { login, switchRole } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await loginLecturer(form);
      const { access_token, user } = response.data;

      login(access_token, user, "lecturer");
      switchRole("lecturer");

      toast.success("Login successful!");
      window.location.href = "/lecturer";
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Login failed. Try again.";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-black to-purple-950 text-white flex items-center justify-center relative overflow-hidden px-4">
      {/* Futuristic Background Elements */}
      <motion.div
        className="absolute w-[30rem] h-[30rem] bg-indigo-500 opacity-20 rounded-full blur-3xl top-[-8rem] left-[-10rem]"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 8 }}
      />
      <motion.div
        className="absolute w-[20rem] h-[20rem] bg-purple-600 opacity-10 rounded-full blur-2xl bottom-[-6rem] right-[-6rem]"
        animate={{ scale: [1, 0.95, 1] }}
        transition={{ repeat: Infinity, duration: 10 }}
      />

      {/* Login Card */}
      <motion.div
        className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-8 z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-purple-200">
          Lecturer Portal
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="user_id" className="block text-sm font-medium mb-1">
              Lecturer ID
            </label>
            <input
              id="user_id"
              name="user_id"
              type="text"
              value={form.user_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 pr-10 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
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
            Sign In
          </Button>
        </form>
        <p className="text-center text-sm text-gray-400 mt-6">
          Powered by{" "}
          <span className="text-purple-300 font-semibold">Present X</span> ·
          Built for the future of education.
        </p>
      </motion.div>
    </div>
  );
}
