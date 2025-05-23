import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { app } from '../firebase';
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";

// Initialize Firebase Authentication
const auth = getAuth(app);

export function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      console.log("User logged in:", userCredential.user);
      navigate('/dashboard');
    } catch (error: any) {
      console.error("Login error:", error.code, error.message);
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
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Google Sign-In Error:', error.message);
      if (
        error.code === 'auth/popup-blocked' ||
        error.code === 'auth/popup-closed-by-user' ||
        error.code === 'auth/browser-popup-blocked'
      ) {
        try {
          await signInWithRedirect(auth, provider);
        } catch (redirectError: any) {
          console.error('Redirect Sign-In Error:', redirectError.message);
          setError('Failed to sign in with Google. Please try again.');
        }
      } else {
        setError('Failed to sign in with Google. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-purple-50">
      <main className="flex-grow flex flex-col items-center justify-center p-4">
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

            <button
              type="button"
              className="px-4 py-2 rounded-lg font-medium w-full mt-2 bg-white text-black border-2 border-blue-500 flex hover:bg-blue-100 items-center justify-center gap-2"
              onClick={handleGoogleLogin}
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google logo"
                className="w-5 h-5"
              />
              Sign in with Google
            </button>
          </form>

          <p className="mt-4 text-center text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-purple-600 hover:text-purple-700 hover:underline font-medium">
              Create one
            </Link>
          </p>

          <p className="mt-4 text-center text-gray-600">
            Forgot password?{' '}
            <Link to="/reset-password" className="text-purple-600 hover:text-purple-700 hover:underline font-medium">
              Reset
            </Link>
          </p>
        </div>
      </main>

      <footer className="bg-white p-4 text-center text-purple-900/70 text-sm">
        © 2025 FlickPredict. All rights reserved.
      </footer>
    </div>
  );
}
