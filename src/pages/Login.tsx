import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { app } from '../firebase';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Initialize Firebase Authentication
const auth = getAuth(app);

export function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error before attempting login

    try {
      // Authenticate user with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      console.log("User logged in:", userCredential.user);

      // Redirect to recommendation page upon successful login
      navigate('/recommend');
    } catch (error: any) {
      console.error("Login error:", error.code, error.message);

      // Handle specific error messages
      if (error.code === "auth/user-not-found") {
        setError("No user found with this email.");
      } else if (error.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else {
        setError("Failed to log in. Please try again later.");
      }
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log('Google user signed in:', user);

      // After successful login, redirect to a protected page (e.g., homepage or dashboard)
      navigate('/recommend');
    } catch (error: any) {
      console.error('Google Sign-In Error:', error.message);
      setError('Failed to sign in with Google. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-center mb-8">
          <Film size={32} className="text-yellow-500" />
          <h1 className="text-3xl font-bold ml-2 text-purple-900">FlickPredict</h1>
        </div>

        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Welcome Back!</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="text"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button type="submit" className="w-full">
            Sign In
          </Button>
          <Button type="button" onClick={handleGoogleLogin} className="w-full">
            Sign in with Google
          </Button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-purple-600 hover:text-purple-700 font-medium">
            Create one
          </Link>
        </p>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 bg-white p-4 text-center text-purple-900/70 text-sm z-10 border-t-4 border-purple-900">
        © 2025 FlickPredict. All rights reserved.
      </div>
    </div>
  );
}
