import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { app } from '../firebase';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from "firebase/auth";

const auth = getAuth(app);

export function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPasswordHint, setShowPasswordHint] = useState(false);
  const [passwordValid, setPasswordValid] = useState({
    length: false,
    uppercase: false,
    specialChar: false,
    number: false
  });

  const typingTimeoutRef = useRef<number | null>(null);

  const validatePassword = (password: string) => {
    const lengthValid = password.length >= 8;
    const uppercaseValid = /[A-Z]/.test(password);
    const specialCharValid = /[!@#$%^&*]/.test(password);
    const numberValid = /[0-9]/.test(password);

    setPasswordValid({
      length: lengthValid,
      uppercase: uppercaseValid,
      specialChar: specialCharValid,
      number: numberValid
    });

    return lengthValid && uppercaseValid && specialCharValid && numberValid;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setFormData({ ...formData, password: newPassword });

    setShowPasswordHint(true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = window.setTimeout(() => {
      setShowPasswordHint(false);
    }, 750);

    validatePassword(newPassword);
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateEmail(formData.email)) {
      setErrors((prev) => ({ ...prev, email: 'Invalid email format' }));
      return;
    }

    if (!validatePassword(formData.password)) {
      setErrors((prev) => ({ ...prev, password: 'Password does not meet requirements' }));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: `${formData.firstName} ${formData.lastName}`,
        photoURL: '/images/dog.jpg'
      });

      console.log("User created:", user);
      navigate("/rate-movies");
    } catch (error: any) {
      console.error("Error creating user:", error.message);
      setErrors((prev) => ({ ...prev, firebase: error.message }));
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Google user:", user);
      navigate("/rate-movies");
    } catch (error: any) {
      console.error("Google Sign-In error:", error.message);
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

          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Create Your Account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                error={errors.firstName}
                required
              />
              <Input
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                error={errors.lastName}
                required
              />
            </div>

            <Input
              label="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              error={errors.username}
              required
            />

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Input
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={handlePasswordChange}
                  error={errors.password}
                  required
                  onFocus={() => setShowPasswordHint(true)}
                />

                {showPasswordHint && (
                  <div className="absolute left-0 top-full mt-2 bg-white shadow-lg p-2 rounded-lg border border-gray-300 text-sm w-56 z-10">
                    <p className={passwordValid.length ? 'text-green-600' : 'text-red-600'}>
                      ✔ At least 8 characters
                    </p>
                    <p className={passwordValid.uppercase ? 'text-green-600' : 'text-red-600'}>
                      ✔ At least one uppercase letter
                    </p>
                    <p className={passwordValid.specialChar ? 'text-green-600' : 'text-red-600'}>
                      ✔ At least one special character (!@#$%^&*)
                    </p>
                    <p className={passwordValid.number ? 'text-green-600' : 'text-red-600'}>
                      ✔ At least one number (0-9)
                    </p>
                  </div>
                )}
              </div>

              <Input
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                error={errors.confirmPassword}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Create Account
            </Button>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full mt-4 font-medium bg-white text-black border-2 border-blue-500 flex hover:bg-blue-100 items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-200"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google logo"
                className="w-5 h-5"
              />
              Create Account with Google
            </button>
          </form>

          <p className="mt-4 text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-600 hover:text-purple-700 hover:underline font-medium">
              Sign in
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
