import { useState, useEffect } from "react";
import { getAuth, updatePassword, User as FirebaseUser, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Input } from "../components/Input";

export function UpdatePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const navigate = useNavigate();

  const [user, setUser] = useState<FirebaseUser | null>(null);
  console.log(user?.displayName)

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Current User:", currentUser);
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });
  
    return () => unsubscribe();
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("No user is signed in.");
      return;
    }

    try {
      await updatePassword(user, newPassword);
      alert("Password updated successfully!");
      navigate("/settings");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Update Password</h2>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button type="submit" className="w-full">Update Password</Button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          <button onClick={() => navigate("/login")} className="text-purple-600 hover:text-purple-700 font-medium">
            Back to Login
          </button>
        </p>
      </div>
    </div>
  );
}
