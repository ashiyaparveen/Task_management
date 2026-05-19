import React, { createContext, useContext, useEffect, useState } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider, isMock } from '../firebase/config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Monitor auth state changes on mount and refresh
  useEffect(() => {
    if (isMock) {
      // Mock persistent session via localStorage
      const savedUser = localStorage.getItem('taskflow_mock_user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error("Failed to parse mock user session", e);
        }
      }
      setLoading(false);
      return () => {}; // No-op unsubscribe for mock mode
    }

    // Standard Firebase Session monitoring
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Google authentication popup or local mock simulation
  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      if (isMock) {
        // Simulate network authorization delay (800ms) for high-end feel
        await new Promise((resolve) => setTimeout(resolve, 800));
        const mockUser = {
          uid: 'mock-user-assessor-123',
          displayName: 'Technical Assessor',
          email: 'assessor@example.com',
          photoURL: 'https://api.dicebear.com/7.x/bottts/svg?seed=assessor',
        };
        localStorage.setItem('taskflow_mock_user', JSON.stringify(mockUser));
        setUser(mockUser);
        return mockUser;
      }

      // Real Firebase PopUp authentication
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out of the session
  const logout = async () => {
    setLoading(true);
    try {
      if (isMock) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        localStorage.removeItem('taskflow_mock_user');
        setUser(null);
        return;
      }

      // Real Firebase signout
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to consume authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

