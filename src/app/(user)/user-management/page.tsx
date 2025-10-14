"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Users,
  Plus,
  ArrowLeft,
  Edit,
  Trash2,
  Search,
  Mail,
  Briefcase,
  User,
  Phone,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { UserFormData, userFormSchema } from "@/lib/validations/userSchema";
import { insertUser } from "@/lib/actions/dbActions";

// Mock user data based on profiles table structure
const mockUsers = [
  {
    id: 1,
    created_at: "2024-01-15T10:30:00Z",
    full_name: "John Doe",
    email: "john.doe@company.com",
    phone: "+1234567890",
    role: "admin" as const,
    designation: "System Administrator",
  },
  {
    id: 2,
    created_at: "2024-01-16T14:20:00Z",
    full_name: "Jane Smith",
    email: "jane.smith@company.com",
    phone: "+1234567890",
    role: "manager" as const,
    designation: "Project Manager",
  },
  {
    id: 3,
    created_at: "2024-01-17T09:15:00Z",
    full_name: "Mike Johnson",
    email: "mike.johnson@company.com",
    phone: "+1234567890",
    role: "user" as const,
    designation: "Software Developer",
  },
  {
    id: 4,
    created_at: "2024-01-18T16:45:00Z",
    full_name: "Sarah Wilson",
    email: "sarah.wilson@company.com",
    phone: "+1234567890",
    role: "user" as const,
    designation: "UX Designer",
  },
];

const UserManagementPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      role: "user",
    },
  });

  const onSubmit = async (data: UserFormData) => {
    setIsSubmitting(true);
    setMessage(null);

    console.log("Form data:", data);

    try {
      const result = await insertUser(data);

      if (result?.error) {
        setMessage({
          type: "error",
          text: result.error,
        });
        return;
      }

      if (result?.success) {
        const newUser = {
          id: users.length + 1,
          created_at: new Date().toISOString(),
          ...data,
        };

        setUsers((prev) => [newUser, ...prev]);
        setMessage({
          type: "success",
          text: result.success,
        });
        reset();
      }
    } catch (error) {
      console.error("Error creating user:", error);
      setMessage({
        type: "error",
        text: "Failed to create user. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDeleteUser = (userId: number) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  const filteredUsers = users.filter(
    (user) =>
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4 text-red-500" />;
      case "manager":
        return <User className="h-4 w-4 text-blue-500" />;
      default:
        return <User className="h-4 w-4 text-green-500" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 border-red-200";
      case "manager":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-green-100 text-green-800 border-green-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        </div>
        <p className="text-muted-foreground">
          Manage user profiles and permissions in your system.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add User Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New User
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-sm font-medium">
                  Full Name *
                </Label>
                <Input
                  {...register("full_name")}
                  id="full_name"
                  placeholder="Enter full name"
                  className="h-11"
                  disabled={isSubmitting}
                />
                {errors.full_name && (
                  <p className="text-sm text-destructive font-medium">
                    {errors.full_name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email *
                </Label>
                <Input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  className="h-11"
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="text-sm text-destructive font-medium">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </Label>
                <Input
                  {...register("phone")}
                  id="phone"
                  placeholder="Enter phone number"
                  className="h-11"
                  disabled={isSubmitting}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive font-medium">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Designation */}
              <div className="space-y-2">
                <Label htmlFor="designation" className="text-sm font-medium">
                  Designation *
                </Label>
                <Input
                  {...register("designation")}
                  id="designation"
                  placeholder="Enter job title/designation"
                  className="h-11"
                  disabled={isSubmitting}
                />
                {errors.designation && (
                  <p className="text-sm text-destructive font-medium">
                    {errors.designation.message}
                  </p>
                )}
              </div>

              {/* Role */}
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium">
                  Role *
                </Label>
                <select
                  {...register("role")}
                  id="role"
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Administrator</option>
                </select>
                {errors.role && (
                  <p className="text-sm text-destructive font-medium">
                    {errors.role.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-11 text-base font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating User...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create User
                  </>
                )}
              </Button>
            </form>

            {/* Message Alert */}
            {message && (
              <Alert
                variant={message.type === "success" ? "default" : "destructive"}
                className="mt-4"
              >
                <AlertDescription className="text-sm">
                  {message.text}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Users List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Users ({filteredUsers.length})
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by name, email, or designation..."
                  className="pl-10 h-11"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No users found</p>
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm truncate">
                            {user.full_name}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(
                              user.role
                            )}`}
                          >
                            {getRoleIcon(user.role)}
                            {user.role.charAt(0).toUpperCase() +
                              user.role.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span className="truncate">{user.email}</span>
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              <span>{user.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Briefcase className="h-3 w-3" />
                            <span>{user.designation}</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Joined {formatDate(user.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => console.log("Edit user:", user.id)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserManagementPage;
