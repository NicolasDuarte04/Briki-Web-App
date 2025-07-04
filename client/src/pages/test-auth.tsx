import React from 'react';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { LoaderCircle } from 'lucide-react';

export default function TestAuthPage() {
  const { user, session, isLoading, isAuthenticated, signInWithGoogle, signOut } = useSupabaseAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <LoaderCircle className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Test Page</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Authentication Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Status</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Authenticated:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${isAuthenticated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {isAuthenticated ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Loading:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${isLoading ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                    {isLoading ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {/* User Information */}
            {isAuthenticated && user && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">User Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                  <div><span className="font-medium">ID:</span> {user.id}</div>
                  <div><span className="font-medium">Email:</span> {user.email}</div>
                  <div><span className="font-medium">Name:</span> {user.name || 'Not set'}</div>
                  <div><span className="font-medium">Role:</span> {user.role || 'user'}</div>
                  {user.avatar_url && (
                    <div><span className="font-medium">Avatar:</span> {user.avatar_url}</div>
                  )}
                </div>
              </div>
            )}

            {/* Session Information */}
            {session && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Session Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                  <div><span className="font-medium">Access Token:</span> {session.access_token ? 'Present' : 'Missing'}</div>
                  <div><span className="font-medium">Refresh Token:</span> {session.refresh_token ? 'Present' : 'Missing'}</div>
                  <div><span className="font-medium">Expires At:</span> {session.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : 'Not set'}</div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Actions</h3>
              <div className="flex gap-4">
                {!isAuthenticated ? (
                  <Button onClick={() => signInWithGoogle()}>
                    Sign in with Google
                  </Button>
                ) : (
                  <Button onClick={() => signOut()} variant="destructive">
                    Sign Out
                  </Button>
                )}
                <Button onClick={() => window.location.href = '/'} variant="outline">
                  Go Home
                </Button>
              </div>
            </div>

            {/* Debug Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Debug Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-xs overflow-auto">
                  {JSON.stringify({ user, session, isAuthenticated, isLoading }, null, 2)}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 