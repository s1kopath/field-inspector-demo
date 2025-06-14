"use client";

import { useEffect, useState } from 'react';
import { Shield, Zap } from 'lucide-react';

export default function SplashScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="text-center z-10 px-8">
        {/* Logo */}
        <div className="mb-8 relative">
          <div className="w-24 h-24 mx-auto bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
            <Shield className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
            <Zap className="w-4 h-4 text-yellow-900" />
          </div>
        </div>

        {/* App Name */}
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
          Field Inspector
        </h1>
        <p className="text-blue-100 text-lg mb-12 font-medium">
          Progressive Enforcement Platform
        </p>

        {/* Loading Progress */}
        <div className="w-64 mx-auto">
          <div className="bg-white/20 rounded-full h-2 mb-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-white to-blue-200 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-blue-100 text-sm">
            Loading... {progress}%
          </p>
        </div>

        {/* Version */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <p className="text-blue-200 text-xs">
            Version 2.1.0 • Progressive Enforcement Demo
          </p>
        </div>
      </div>
    </div>
  );
}