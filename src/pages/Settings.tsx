import React, { useState } from 'react';
import { Bell, Camera, ChevronRight, Film, Key, Lock, LogOut, Mail, Moon, Shield, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { auth } from '../firebase';
import { User as FirebaseUser, onAuthStateChanged, getAuth } from 'firebase/auth';
import { useEffect } from 'react';

export function Settings() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  console.log(user?.displayName)
  const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200');

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
  
  const settingsSections = [
    {
      title: 'Account',
      items: [
        { icon: <User size={20} />, label: 'Profile Information', action: 'Edit' },
        { icon: <Mail size={20} />, label: 'Email Settings', action: 'Change' },
        { icon: <Key size={20} />, label: 'Password', action: 'Update' }
      ]
    },
    {
      title: 'Preferences',
      items: [
        { icon: <Bell size={20} />, label: 'Notifications', action: 'Manage' },
        { icon: <Moon size={20} />, label: 'Dark Mode', action: 'Toggle' }
      ]
    },
    {
      title: 'Privacy & Security',
      items: [
        { icon: <Shield size={20} />, label: 'Privacy Settings', action: 'Review' },
        { icon: <Lock size={20} />, label: 'Security Settings', action: 'Manage' }
      ]
    }
  ];


  return (
    <>
      <Link to="/" className="block" style={{ paddingTop: '20px', paddingLeft: '10px' }}>
        <div className="flex items-center gap-3 mb-10">
          <Film className="text-yellow-500" size={32} />
          <h1 className="text-3xl font-bold text-purple-900">FlickPredict</h1>
        </div>
      </Link>
      <div className="ml-64 p-8 bg-purple-50 min-h-screen">
        <h1 className="text-2xl font-bold text-purple-900 mb-8">Account Settings</h1>

        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-6">
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
            <div>
              <h2 className="text-xl font-semibold text-purple-900">{user?.displayName}</h2>
              <p className="text-purple-600">{user?.email}</p>
              {/* <p className="text-sm text-gray-500 mt-1">Member since ???</p> */}
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
            onClick={() => auth.signOut().then(() => console.log("Logged out"))}
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>
    </>
  );
}