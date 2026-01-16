"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { auth } from "./firebase";
import axiosInstance from "../lib/axiosInstance";

/* ===============================
   TYPES
================================ */

export interface User {
  _id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio?: string;
  joinedDate: string;
  email: string;
  website: string;
  location: string;

  // 🔔 Notification settings
  notificationsEnabled: boolean;
  soundEnabled: boolean;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>; // ✅ ADD THIS
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    username: string,
    displayName: string
  ) => Promise<void>;
  updateProfile: (profileData: {
    displayName: string;
    bio: string;
    location: string;
    website: string;
    avatar: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  googlesignin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>(null as any);

/* ===============================
   HOOK
================================ */

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}

/* ===============================
   PROVIDER
================================ */

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /* ===============================
     CHECK AUTH STATE ON LOAD
  ================================ */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser?.email) {
        try {
          const res = await axiosInstance.get("/loggedinuser", {
            params: { email: firebaseUser.email },
          });

          if (res.data) {
            setUser(res.data);
            localStorage.setItem(
              "twitter-user",
              JSON.stringify(res.data)
            );
          }
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      } else {
        setUser(null);
        localStorage.removeItem("twitter-user");
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /* ===============================
     LOGIN
  ================================ */
  const login = async (email: string, password: string) => {
    setIsLoading(true);

    const userCred = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const res = await axiosInstance.get("/loggedinuser", {
      params: { email: userCred.user.email },
    });

    if (res.data) {
      setUser(res.data);
      localStorage.setItem("twitter-user", JSON.stringify(res.data));
    }

    setIsLoading(false);
  };

  /* ===============================
     SIGNUP
  ================================ */
  const signup = async (
    email: string,
    password: string,
    username: string,
    displayName: string
  ) => {
    setIsLoading(true);

    const userCred = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const newUser = {
      username,
      displayName,
      avatar:
        userCred.user.photoURL ||
        "https://images.pexels.com/photos/1139743/pexels-photo-1139743.jpeg",
      email: userCred.user.email,
    };

    const res = await axiosInstance.post("/register", newUser);

    if (res.data) {
      setUser(res.data);
      localStorage.setItem("twitter-user", JSON.stringify(res.data));
    }

    setIsLoading(false);
  };

  /* ===============================
     LOGOUT
  ================================ */
  const logout = async () => {
    setUser(null);
    await signOut(auth);
    localStorage.removeItem("twitter-user");
  };

  /* ===============================
     UPDATE PROFILE
  ================================ */
  const updateProfile = async (profileData: {
    displayName: string;
    bio: string;
    location: string;
    website: string;
    avatar: string;
  }) => {
    if (!user && !isLoading) return;

    setIsLoading(true);

    const updatedUser: User = {
      ...user!,
      ...profileData,
    };

    await axiosInstance.patch(
      `/userupdate/${user!.email}`,
      updatedUser
    );

    setUser(updatedUser);
    localStorage.setItem(
      "twitter-user",
      JSON.stringify(updatedUser)
    );

    setIsLoading(false);
  };

  /* ===============================
     GOOGLE SIGN-IN
  ================================ */
  const googlesignin = async () => {
    setIsLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      if (!result.user.email) {
        throw new Error("No email found");
      }

      let userData;

      try {
        const res = await axiosInstance.get("/loggedinuser", {
          params: { email: result.user.email },
        });
        userData = res.data;
      } catch {
        const newUser = {
          username: result.user.email.split("@")[0],
          displayName: result.user.displayName || "User",
          avatar:
            result.user.photoURL ||
            "https://images.pexels.com/photos/1139743/pexels-photo-1139743.jpeg",
          email: result.user.email,
        };

        const registerRes = await axiosInstance.post(
          "/register",
          newUser
        );
        userData = registerRes.data;
      }

      setUser(userData);
      localStorage.setItem("twitter-user", JSON.stringify(userData));
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      alert(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  /* ===============================
     PROVIDER VALUE
  ================================ */
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser, // ✅ EXPOSE setUser
        login,
        signup,
        updateProfile,
        logout,
        isLoading,
        googlesignin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
