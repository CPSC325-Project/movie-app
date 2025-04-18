import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { app } from "../firebase";
import { Button } from "../components/Button";
import { Input } from "../components/Input";

// Initialize Firebase Authentication
const auth = getAuth(app);

export function ResetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!email) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("A password reset link has been sent to your email.");
    } catch (error: any) {
      console.error("Password Reset Error:", error.message);
      setError("Error sending reset email. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-purple-50">
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Reset Password</h2>

          <form onSubmit={handleResetPassword} className="space-y-4">
            <Input
              label="Enter your email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {message && <p className="text-green-500 text-sm">{message}</p>}

            <Button type="submit" className="w-full">Send Reset Link</Button>
          </form>

          <p className="mt-4 text-center text-gray-600">
            <button
              onClick={() => navigate("/login")}
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Back to Login
            </button>
          </p>
        </div>
      </main>

      <footer className="bg-white p-4 text-center text-purple-900/70 text-sm">
        © 2025 FlickPredict. All rights reserved.
      </footer>
    </div>
  );
}
