import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Define form data type
interface FormData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

// Define errors type
interface Errors {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  confirmPassword?: string;
  form?: string;
}

// Email validation helper
const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Password validation helper (customize as needed)
const validatePassword = (password: string) => {
  return password.length >= 6; // Example rule
};

const RegisterForm = () => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Errors>({});
  const [showPasswordHint, setShowPasswordHint] = useState(false);
  const [passwordValid, setPasswordValid] = useState({
    length: false,
    uppercase: false,
    specialChar: false,
    number: false,
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setFormData({ ...formData, password: newPassword });

    // Show validation pop-up when typing
    setShowPasswordHint(newPassword.length > 0);

    // Validate password
    setPasswordValid({
      length: newPassword.length >= 8,
      uppercase: /[A-Z]/.test(newPassword),
      specialChar: /[!@#$%^&*]/.test(newPassword),
      number: /[0-9]/.test(newPassword),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors

    // Frontend validation
    const newErrors: Errors = {};

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit to API
    try {
      const response = await fetch('http://54.177.14.82:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Save user info & authenticated flag to localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('authenticated', JSON.stringify(data.authenticated));
        navigate('/rate-movies'); // Redirect after success
      } else if (response.status === 422) {
        const errorData = await response.json();
        const backendErrors: Record<string, string> = {};

        if (Array.isArray(errorData.detail)) {
          errorData.detail.forEach((error: { loc: string[]; msg: string }) => {
            const field = error.loc[1];  // Example: ["body", "email"]
            backendErrors[field] = error.msg;
          });
        }

        setErrors(backendErrors);
      } else {
        setErrors({ form: 'An unexpected error occurred. Please try again.' });
      }
    } catch (error) {
      setErrors({ form: 'Failed to connect to the server. Please try again later.' });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-4">Register</h2>

      {errors.form && <p className="text-red-600 mb-4">{errors.form}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="mt-1 block w-full border rounded p-2"
          />
          {errors.username && <p className="text-red-600 text-sm">{errors.username}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full border rounded p-2"
          />
          {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="mt-1 block w-full border rounded p-2"
          />
          {errors.firstName && <p className="text-red-600 text-sm">{errors.firstName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="mt-1 block w-full border rounded p-2"
          />
          {errors.lastName && <p className="text-red-600 text-sm">{errors.lastName}</p>}
        </div>

        <div className="relative">
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handlePasswordChange}
            className="mt-1 block w-full border rounded p-2"
          />
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
          {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="mt-1 block w-full border rounded p-2"
          />
          {errors.confirmPassword && <p className="text-red-600 text-sm">{errors.confirmPassword}</p>}
        </div>

        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
          Create Account
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;