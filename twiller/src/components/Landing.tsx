"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import AuthModal from "./Authmodel";
import TwitterLogo from "./Twitterlogo";
import { useAuth } from "@/context/AuthContext";
import Feed from "./Feed";

export default function LandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");
  const { user, logout ,googlesignin} = useAuth();

  const openAuthModal = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };
  if (user) {
    return <Feed/>;
  }
  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Left side - Logo */}
      <div className="hidden lg:flex lg:flex-1 items-center justify-center">
        <TwitterLogo className="text-white h-80 w-80" />
      </div>
      {/* Right side - Content */}
      <div className="flex-1 lg:flex-1 flex flex-col justify-center px-8 lg:px-16 max-w-lg lg:max-w-2xl">
        <div className="lg:hidden mb-8 text-center">
          <TwitterLogo size="xl" className="text-white mx-auto" />
        </div>

        <div className="space-y-12">
          <div>
            <h1 className="text-5xl lg:text-6xl font-bold mb-8 leading-tight">
              Happening now
            </h1>
            <h2 className="text-2xl lg:text-3xl font-bold mb-8">Join today.</h2>
          </div>

          <div className="space-y-4 max-w-xs">
            <Button
              variant="outline"
              className="w-full py-3 rounded-full border-gray-600 bg-black  text-white font-semibold text-base h-12"
              onClick={() => googlesignin()}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign up with Google
            </Button>

            <Button
              variant="outline"
              className="w-full py-3 rounded-full border-gray-600  bg-black text-white font-semibold text-base h-12"
             onClick={() => googlesignin()}
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Sign up with Apple
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-600" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black px-2 text-gray-400">or</span>
              </div>
            </div>
            <Button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-full text-base h-12"
              onClick={() => openAuthModal("signup")}
            >
              Create account
            </Button>
            <p className="text-xs text-gray-400 leading-relaxed">
              By signing up, you agree to the{" "}
              <a href="#" className="text-blue-400 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-400 hover:underline">
                Privacy Policy
              </a>
              , including{" "}
              <a href="#" className="text-blue-400 hover:underline">
                Cookie Use
              </a>
              .
            </p>
          </div>
          <div className="space-y-5">
            <p className="text-lg font-bold">Already have an account?</p>
            <Button
              variant="outline"
              className="w-full max-w-xs py-3 rounded-full border-gray-600 hover:bg-gray-900 text-blue-400 font-semibold text-base h-12"
              onClick={() => openAuthModal("login")}
            >
              Log in
            </Button>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </div>
  );
}
