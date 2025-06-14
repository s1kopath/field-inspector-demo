"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import {
  Building2,
  MapPin,
  Clock,
  Download,
  Wifi,
  WifiOff,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  XCircle,
  User,
  LogOut,
  Settings,
  Bell,
  ArrowRight,
  HardDrive,
  Loader2,
} from "lucide-react";

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

interface PropertyDashboardProps {
  user: User;
  onPropertySelect: (property: Property) => void;
  onLogout: () => void;
  isOnline: boolean;
  onToggleOnline: () => void;
}

const MOCK_PROPERTIES: Property[] = [
  {
    id: "1",
    name: "Downtown Office Complex",
    address: "123 Business Ave, Downtown",
    type: "Commercial",
    lastInspection: "2024-01-15",
    status: "pending",
    equipmentCount: 24,
    downloadSize: "2.4 MB",
    isDownloaded: false,
  },
  {
    id: "2",
    name: "Riverside Manufacturing Plant",
    address: "456 Industrial Blvd, Riverside",
    type: "Industrial",
    lastInspection: "2024-01-10",
    status: "overdue",
    equipmentCount: 48,
    downloadSize: "4.8 MB",
    isDownloaded: true,
  },
  {
    id: "3",
    name: "Metro Shopping Center",
    address: "789 Retail St, Metro",
    type: "Retail",
    lastInspection: "2024-01-18",
    status: "completed",
    equipmentCount: 16,
    downloadSize: "1.6 MB",
    isDownloaded: false,
  },
  {
    id: "4",
    name: "Harbor Logistics Center",
    address: "321 Port Way, Harbor",
    type: "Warehouse",
    lastInspection: "2024-01-12",
    status: "pending",
    equipmentCount: 32,
    downloadSize: "3.2 MB",
    isDownloaded: true,
  },
  {
    id: "5",
    name: "University Research Lab",
    address: "654 Campus Dr, University",
    type: "Educational",
    lastInspection: "2024-01-08",
    status: "overdue",
    equipmentCount: 12,
    downloadSize: "1.2 MB",
    isDownloaded: false,
  },
];

export default function PropertyDashboard({
  user,
  onPropertySelect,
  onLogout,
  isOnline,
  onToggleOnline,
}: PropertyDashboardProps) {
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "completed" | "overdue"
  >("all");
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || property.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleDownload = async (propertyId: string) => {
    setDownloadingIds((prev) => new Set(prev).add(propertyId));

    // Simulate download
    setTimeout(() => {
      setProperties((prev) =>
        prev.map((p) =>
          p.id === propertyId ? { ...p, isDownloaded: true } : p
        )
      );
      setDownloadingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(propertyId);
        return newSet;
      });
    }, 3000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "pending":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "overdue":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalDownloadSize = properties
    .filter((p) => !p.isDownloaded)
    .reduce((total, p) => total + parseFloat(p.downloadSize), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Field Inspector
                </h1>
                <p className="text-xs text-gray-500">Property Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleOnline}
                className={`flex items-center space-x-2 ${
                  isOnline ? "text-green-600" : "text-red-600"
                }`}
              >
                {isOnline ? (
                  <Wifi className="w-4 h-4" />
                ) : (
                  <WifiOff className="w-4 h-4" />
                )}
                <span>{isOnline ? "Online" : "Offline"}</span>
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name.split(" ")[0]}!
          </h2>
          <p className="text-gray-600">
            You have{" "}
            {filteredProperties.filter((p) => p.status === "pending").length}{" "}
            pending inspections
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Properties
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {properties.length}
                  </p>
                </div>
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {properties.filter((p) => p.status === "pending").length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overdue</p>
                  <p className="text-2xl font-bold text-red-600">
                    {properties.filter((p) => p.status === "overdue").length}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {properties.filter((p) => p.status === "completed").length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Offline Mode Alert */}
        {!isOnline && (
          <Alert className="mb-6 border-amber-200 bg-amber-50">
            <WifiOff className="w-4 h-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <div className="flex items-center justify-between">
                <span>
                  You're working offline. Download property data to continue
                  inspections.
                </span>
                <Badge className="bg-amber-100 text-amber-800">
                  {properties.filter((p) => p.isDownloaded).length} of{" "}
                  {properties.length} downloaded
                </Badge>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {["all", "pending", "completed", "overdue"].map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus(status as any)}
                className="capitalize"
              >
                {status}
              </Button>
            ))}
          </div>
        </div>

        {/* Bulk Download Section */}
        {!isOnline && totalDownloadSize > 0 && (
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-900">
                <HardDrive className="w-5 h-5 mr-2" />
                Offline Data Management
              </CardTitle>
              <CardDescription className="text-blue-700">
                Download property data for offline inspections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-800">
                    {properties.filter((p) => !p.isDownloaded).length}{" "}
                    properties need download
                  </p>
                  <p className="text-xs text-blue-600">
                    Total size: {totalDownloadSize.toFixed(1)} MB
                  </p>
                </div>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    properties
                      .filter((p) => !p.isDownloaded)
                      .forEach((p) => handleDownload(p.id));
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download All
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Properties Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <Card
              key={property.id}
              className="hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                      {property.name}
                    </CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      {property.address}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(property.status)}>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(property.status)}
                      <span className="capitalize">{property.status}</span>
                    </div>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">{property.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Equipment:</span>
                    <span className="font-medium">
                      {property.equipmentCount} items
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Last Inspection:</span>
                    <span className="font-medium">
                      {property.lastInspection}
                    </span>
                  </div>

                  {/* Download Status */}
                  <div className="pt-3 border-t">
                    {property.isDownloaded ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-green-600 text-sm">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Downloaded ({property.downloadSize})
                        </div>
                        <Button
                          onClick={() => onPropertySelect(property)}
                          size="sm"
                          className="bg-gradient-to-r from-blue-600 to-indigo-600"
                        >
                          Inspect
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Size: {property.downloadSize}
                        </span>
                        <div className="flex space-x-2">
                          {downloadingIds.has(property.id) ? (
                            <Button size="sm" disabled>
                              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                              Downloading...
                            </Button>
                          ) : (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownload(property.id)}
                              >
                                <Download className="w-4 h-4 mr-1" />
                                Download
                              </Button>
                              {isOnline && (
                                <Button
                                  onClick={() => onPropertySelect(property)}
                                  size="sm"
                                  className="bg-gradient-to-r from-blue-600 to-indigo-600"
                                >
                                  Inspect
                                  <ArrowRight className="w-4 h-4 ml-1" />
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No properties found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
