import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  auth, 
  db, 
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  FirebaseUser
} from '../lib/firebase';
import { UserProfile, UserRole } from '../types';
import { logAuditEvent } from '../services/auditLogger';

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  role: UserRole;
  loading: boolean;
  login: (email: string, pass: string) => Promise<UserProfile>;
  signup: (name: string, email: string, pass: string, role: UserRole) => Promise<UserProfile>;
  googleSignIn: (role?: UserRole) => Promise<UserProfile>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  switchDemoRole: (role: UserRole) => void;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to fetch user profile from Firestore or construct fallback
  const fetchOrCreateProfile = async (firebaseUser: FirebaseUser, defaultRole: UserRole = 'customer', name?: string): Promise<UserProfile> => {
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data() as UserProfile;
        const completeProfile: UserProfile = {
          uid: firebaseUser.uid,
          name: data.name || firebaseUser.displayName || 'Coremay User',
          email: data.email || firebaseUser.email || '',
          role: data.role || 'customer',
          createdAt: data.createdAt || new Date().toISOString(),
          profileCompleted: data.profileCompleted ?? true,
          storeName: data.storeName || (data.role === 'merchant' ? 'Coremay Official Store' : undefined),
          avatarUrl: data.avatarUrl || firebaseUser.photoURL || undefined
        };
        setProfile(completeProfile);
        return completeProfile;
      } else {
        // Create new user profile document
        const newProfile: UserProfile = {
          uid: firebaseUser.uid,
          name: name || firebaseUser.displayName || (firebaseUser.email?.split('@')[0] || 'User'),
          email: firebaseUser.email || '',
          role: defaultRole,
          createdAt: new Date().toISOString(),
          profileCompleted: true,
          storeName: defaultRole === 'merchant' ? 'Coremay Official Store' : undefined,
          avatarUrl: firebaseUser.photoURL || undefined
        };
        await setDoc(userRef, {
          ...newProfile,
          updatedAt: serverTimestamp()
        });
        setProfile(newProfile);
        return newProfile;
      }
    } catch (err) {
      console.warn('[AuthContext] Firestore profile fetch/write error, using fallback:', err);
      const fallback: UserProfile = {
        uid: firebaseUser.uid,
        name: name || firebaseUser.displayName || 'Coremay User',
        email: firebaseUser.email || '',
        role: defaultRole,
        createdAt: new Date().toISOString(),
        profileCompleted: true,
        storeName: defaultRole === 'merchant' ? 'Coremay Official Store' : undefined
      };
      setProfile(fallback);
      return fallback;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchOrCreateProfile(currentUser);
      } else {
        setUser(null);
        // Default guest/demo initial state for seamless preview
        const storedRole = (localStorage.getItem('gp_demo_role') as UserRole) || 'customer';
        setProfile({
          uid: 'demo_guest_user',
          name: storedRole === 'merchant' ? 'Sarah Merchant (Demo)' : 'Alex Shopper (Demo)',
          email: storedRole === 'merchant' ? 'merchant@coremay.ai' : 'shopper@coremay.ai',
          role: storedRole,
          createdAt: new Date().toISOString(),
          profileCompleted: true,
          storeName: 'Coremay Flagship Electronics'
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (name: string, email: string, pass: string, role: UserRole): Promise<UserProfile> => {
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      const newProfile = await fetchOrCreateProfile(cred.user, role, name);
      setUser(cred.user);
      setProfile(newProfile);

      await logAuditEvent({
        userId: cred.user.uid,
        userEmail: email,
        userName: name,
        actionType: 'CUSTOMER_SEARCH',
        description: `New ${role} account registered: ${email}`,
        metadata: { role }
      });

      return newProfile;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, pass: string): Promise<UserProfile> => {
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      const loadedProfile = await fetchOrCreateProfile(cred.user);
      setUser(cred.user);
      setProfile(loadedProfile);
      return loadedProfile;
    } finally {
      setLoading(false);
    }
  };

  const googleSignIn = async (role: UserRole = 'customer'): Promise<UserProfile> => {
    setLoading(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const loadedProfile = await fetchOrCreateProfile(cred.user, role);
      setUser(cred.user);
      setProfile(loadedProfile);
      return loadedProfile;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.warn('Logout error', e);
    }
    setUser(null);
    setProfile(null);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const switchDemoRole = (newRole: UserRole) => {
    localStorage.setItem('gp_demo_role', newRole);
    if (!user) {
      setProfile({
        uid: newRole === 'merchant' ? 'demo_merchant_user' : 'demo_customer_user',
        name: newRole === 'merchant' ? 'Sarah Merchant (Coremay Admin)' : 'Alex Shopper (Verified Buyer)',
        email: newRole === 'merchant' ? 'merchant@coremay.ai' : 'alex.shopper@gmail.com',
        role: newRole,
        createdAt: new Date().toISOString(),
        profileCompleted: true,
        storeName: 'Coremay Flagship Store'
      });
    } else if (profile) {
      const updated = { ...profile, role: newRole };
      setProfile(updated);
      try {
        setDoc(doc(db, 'users', user.uid), { role: newRole }, { merge: true });
      } catch (err) {
        console.warn('Role update sync warning:', err);
      }
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!profile) return;
    const updated = { ...profile, ...data };
    setProfile(updated);
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), data, { merge: true });
      } catch (e) {
        console.warn('Update user profile warning:', e);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role: profile?.role || 'customer',
        loading,
        login,
        signup,
        googleSignIn,
        logout,
        resetPassword,
        switchDemoRole,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
