import React from 'react';
import { Button } from '../ui/button';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { LogOut, User, Settings } from 'lucide-react';

export default function UserProfile() {
  const { user, signOut, isLoading } = useSupabaseAuth();

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* User Avatar */}
      <div className="flex items-center gap-2">
        {user.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={user.name || 'User'}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        )}
        
        {/* User Info */}
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-gray-900">
            {user.name || user.email?.split('@')[0] || 'User'}
          </p>
          <p className="text-xs text-gray-500">
            {user.email}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.location.href = '/profile'}
          className="hidden sm:flex items-center gap-1 text-gray-600 hover:text-gray-900"
        >
          <User className="w-4 h-4" />
          <span>Profile</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.location.href = '/settings'}
          className="hidden sm:flex items-center gap-1 text-gray-600 hover:text-gray-900"
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          disabled={isLoading}
          className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </Button>
      </div>
    </div>
  );
} 