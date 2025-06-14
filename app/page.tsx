"use client";

import { useState, useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";
import LoginScreen from "@/components/LoginScreen";
import PropertyDashboard from "@/components/PropertyDashboard";
import InspectionWorkflow from "@/components/InspectionWorkflow";

type AppState = "splash" | "login" | "dashboard" | "inspection";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Property {
  id: string;
  name: string;
  address: string;
  type: string;
  lastInspection: string;
  status: "pending" | "completed" | "overdue";
  equipmentCount: number;
  downloadSize: string;
  isDownloaded: boolean;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppState>("splash");
  const [user, setUser] = useState<User | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [isOnline, setIsOnline] = useState(true);

  // Handle splash screen timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentScreen("login");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Handle login
  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentScreen("dashboard");
  };

  // Handle property selection
  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
    setCurrentScreen("inspection");
  };

  // Handle back to dashboard
  const handleBackToDashboard = () => {
    setSelectedProperty(null);
    setCurrentScreen("dashboard");
  };

  // Handle logout
  const handleLogout = () => {
    setUser(null);
    setSelectedProperty(null);
    setCurrentScreen("login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentScreen === "splash" && <SplashScreen />}

      {currentScreen === "login" && <LoginScreen onLogin={handleLogin} />}

      {currentScreen === "dashboard" && user && (
        <PropertyDashboard
          user={user}
          onPropertySelect={handlePropertySelect}
          onLogout={handleLogout}
          isOnline={isOnline}
          onToggleOnline={() => setIsOnline(!isOnline)}
        />
      )}

      {currentScreen === "inspection" && user && selectedProperty && (
        <InspectionWorkflow
          user={user}
          property={selectedProperty}
          onBack={handleBackToDashboard}
          isOnline={isOnline}
          onLogout={handleLogout}
          onToggleOnline={() => setIsOnline(!isOnline)}
        />
      )}
    </div>
  );
}
