import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login logic with Supabase
    navigate('/rate-movies');
  };

  return (
    <div className="min-h-screen bg-purple-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-center mb-8">
          <Film size={32} className="text-purple-600" />
          <h1 className="text-3xl font-bold ml-2 text-purple-900">FlickPredict</h1>
        </div>

        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Welcome Back</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
            required
          />

          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
            required
          />

          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-purple-600 hover:text-purple-700 font-medium">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}