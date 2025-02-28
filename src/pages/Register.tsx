import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, ArrowLeft } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

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

  // Password validation function
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

    // Show validation pop-up when typing
    setShowPasswordHint(newPassword.length > 0);

    // Validate password
    validatePassword(newPassword);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: 'Invalid email format'
      }));
      return;
    }

    if (!validatePassword(formData.password)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: 'Password does not meet requirements'
      }));
      return;
    }

    // Check if password and confirm password match
    if (formData.password !== formData.confirmPassword) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: 'Passwords do not match'
      }));
      return;
    }

    // TODO: Implement registration logic with Supabase
    navigate('/rate-movies');
  };

  return (
    <div className="min-h-screen bg-purple-50 flex flex-col items-center justify-center p-4">

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

          {/* Password and Confirm Password side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={handlePasswordChange}
                error={errors.password}
                required
              />

              {/* Password Validation Pop-up */}
              {showPasswordHint && (
                <div className="absolute left-0 top-full mt-2 bg-white shadow-lg p-2 rounded-lg border border-gray-300 text-sm w-56">
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
        </form>

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-600 hover:text-purple-700 font-medium">
            Sign in
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
