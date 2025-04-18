import { useState, useEffect } from 'react';
import { Camera, ChevronRight, Film, Key, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { auth } from '../firebase';
import { User as FirebaseUser, onAuthStateChanged, getAuth } from 'firebase/auth';

export function Settings() {
  const navigate = useNavigate();
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { icon: <Key size={20} />, label: 'Password', action: 'Update' }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-purple-50">
      <main className="flex-grow">
        {/* Header */}
        <div className="px-4 md:px-8 pt-6 md:pt-10 pb-4 md:ml-64">
          <Link to="/" className="block mb-6">
            <div className="flex items-center gap-3">
              <Film className="text-yellow-500" size={32} />
              <h1 className="text-3xl font-bold text-purple-900">FlickPredict</h1>
            </div>
          </Link>

          <h1 className="text-2xl font-bold text-purple-900 mb-8">Account Settings</h1>

          {/* Profile Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col sm:flex-row items-center sm:space-x-6 space-y-4 sm:space-y-0">
              <div className="relative">
                <img
                  src={user?.photoURL ?? ''}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
                <button 
                  className="absolute bottom-0 right-0 bg-purple-600 p-2 rounded-full text-white hover:bg-purple-700 transition-colors"
                  onClick={() => console.log('Change profile image')}
                >
                  <Camera size={16} />
                </button>
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-xl font-semibold text-purple-900">{user?.displayName}</h2>
                <p className="text-purple-600">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Settings Sections */}
          {settingsSections.map((section, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-4">{section.title}</h3>
              <div className="space-y-4">
                {section.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex items-center justify-between p-3 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                    onClick={() => {
                      if (item.label === "Password") {
                        navigate("/update-password");
                      }
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-purple-600">{item.icon}</span>
                      <span className="text-gray-700">{item.label}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-purple-600">
                      <span className="text-sm">{item.action}</span>
                      <ChevronRight size={16} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Logout Button */}
          <div className="mt-8">
            <Button
              variant="outline"
              className="text-red-600 border-red-600 hover:bg-red-50 flex items-center space-x-2"
              onClick={() => {
                auth.signOut().then(() => console.log("Logged out"));
                navigate("/");
              }}
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </main>

      <footer className="bg-white p-4 text-center text-purple-900/70 text-sm">
        © 2025 FlickPredict. All rights reserved.
      </footer>
    </div>
  );
}