"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { User } from "@supabase/supabase-js";
import Link from "next/link";

interface DashboardStats {
  totalRevenue: number;
  newUsers: number;
  conversions: number;
  bounceRate: number;
}

export default function Dashboard({ user }: { user: User }) {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    newUsers: 0,
    conversions: 0,
    bounceRate: 0,
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Simulate fetching data
    const fetchDashboardData = async () => {
      setLoading(true);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data - replace with actual Supabase queries
      setStats({
        totalRevenue: 12450,
        newUsers: 234,
        conversions: 12.5,
        bounceRate: 28.3,
      });
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    trendValue,
    description,
  }: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    trend?: "up" | "down";
    trendValue?: string;
    description?: string;
  }) => (
    <Card className="flex-1 min-w-[200px]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading ? (
            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
          ) : (
            value
          )}
        </div>
        {trend && trendValue && (
          <p
            className={`text-xs flex items-center mt-1 ${
              trend === "up" ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend === "up" ? (
              <ArrowUpRight className="h-3 w-3 mr-1" />
            ) : (
              <ArrowDownRight className="h-3 w-3 mr-1" />
            )}
            {trendValue}
          </p>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard - {user?.user_metadata?.email}
        </h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Revenue"
          value={loading ? "" : `$${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend="up"
          trendValue="+12.5% from last month"
        />
        <StatCard
          title="New Users"
          value={loading ? "" : stats.newUsers.toLocaleString()}
          icon={Users}
          trend="up"
          trendValue="+8.2% from last week"
        />
        <StatCard
          title="Conversion Rate"
          value={loading ? "" : `${stats.conversions}%`}
          icon={TrendingUp}
          trend="down"
          trendValue="-2.1% from last month"
        />
        <StatCard
          title="Bounce Rate"
          value={loading ? "" : `${stats.bounceRate}%`}
          icon={BarChart3}
          trend="down"
          trendValue="-5.3% from last week"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {[
                  {
                    action: "New user registration",
                    time: "2 min ago",
                    type: "user",
                  },
                  {
                    action: "Payment received",
                    time: "5 min ago",
                    type: "payment",
                  },
                  {
                    action: "Project updated",
                    time: "1 hour ago",
                    type: "project",
                  },
                  {
                    action: "New comment",
                    time: "2 hours ago",
                    type: "comment",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div
                      className={`h-2 w-2 rounded-full ${
                        item.type === "user"
                          ? "bg-green-500"
                          : item.type === "payment"
                          ? "bg-blue-500"
                          : item.type === "project"
                          ? "bg-purple-500"
                          : "bg-orange-500"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
              <Button
                className="w-full justify-start "
                // variant="outline"
                asChild
              >
                <Link href={"/user-management"}>
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <DollarSign className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32 bg-muted/30 rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground text-sm">
                Performance chart placeholder
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                "System update completed",
                "New features available",
                "Maintenance scheduled",
              ].map((update, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 text-sm"
                >
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <span>{update}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
