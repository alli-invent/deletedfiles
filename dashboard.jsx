import React from 'react';
import { Link } from 'react-router-dom';
import { useFeatures } from '../../hooks/use-features';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  Plus
} from 'lucide-react';

const AdminDashboard = () => {
  const { getUsage, currentPlan, isFree } = useFeatures();

  const usage = {
    students: getUsage('students'),
    courses: getUsage('courses'),
    storage: getUsage('storage'),
  };

  // Mock data - in real app, this would come from API
  const stats = [
    {
      title: 'Total Students',
      value: '1,247',
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'blue',
    },
    {
      title: 'Active Courses',
      value: '24',
      change: '+3%',
      trend: 'up',
      icon: BookOpen,
      color: 'green',
    },
    {
      title: 'Monthly Revenue',
      value: '$8,420',
      change: '+18%',
      trend: 'up',
      icon: DollarSign,
      color: 'purple',
    },
    {
      title: 'Completion Rate',
      value: '87%',
      change: '+5%',
      trend: 'up',
      icon: TrendingUp,
      color: 'orange',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      action: 'New enrollment',
      user: 'Sarah Johnson',
      course: 'WEB101',
      time: '2 hours ago',
    },
    {
      id: 2,
      action: 'Course completed',
      user: 'Mike Chen',
      course: 'DS201',
      time: '4 hours ago',
    },
    {
      id: 3,
      action: 'Payment received',
      user: 'Emily Davis',
      amount: '$299',
      time: '1 day ago',
    },
    {
      id: 4,
      action: 'New instructor',
      user: 'Dr. Robert Wilson',
      time: '2 days ago',
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Overview of your institution's performance and activity
          </p>
        </div>
        <div className="flex space-x-3">
          <Link to="/admin/courses/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Course
            </Button>
          </Link>
        </div>
      </div>

      {/* Usage Alert for Free Plan */}
      {isFree && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
              <div className="flex-1">
                <p className="text-yellow-800 font-medium">
                  You're on the Free Plan
                </p>
                <p className="text-yellow-700 text-sm">
                  Upgrade to unlock more features and higher limits
                </p>
              </div>
              <Link to="/admin/billing">
                <Button variant="outline" size="sm">
                  Upgrade Plan
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </p>
                    <div className="flex items-center mt-2">
                      <Badge
                        variant={
                          stat.trend === 'up' ? 'success' : 'destructive'
                        }
                        className="text-xs"
                      >
                        {stat.change}
                      </Badge>
                      <span className="text-gray-500 text-xs ml-2">
                        from last month
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${getColorClasses(
                      stat.color
                    )}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest actions and events in your institution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-2 h-2 rounded-full bg-primary-600 mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-600">
                      {activity.user}
                      {activity.course && ` • ${activity.course}`}
                      {activity.amount && ` • ${activity.amount}`}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500 whitespace-nowrap">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link to="/admin/activity">
                <Button variant="outline" className="w-full">
                  View All Activity
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Usage Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Overview</CardTitle>
            <CardDescription>
              Current resource usage and limits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Students</span>
                  <span className="text-sm text-gray-600">
                    {usage.students.used} / {usage.students.limit || 'Unlimited'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min(usage.students.percentage, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Courses</span>
                  <span className="text-sm text-gray-600">
                    {usage.courses.used} / {usage.courses.limit || 'Unlimited'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min(usage.courses.percentage, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Storage</span>
                  <span className="text-sm text-gray-600">
                    {(usage.storage.used / 1024 / 1024 / 1024).toFixed(2)} GB /{' '}
                    {(usage.storage.limit / 1024 / 1024 / 1024).toFixed(2)} GB
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min(usage.storage.percentage, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Current Plan: {currentPlan}</p>
                  <p className="text-sm text-gray-600">
                    {isFree
                      ? 'Upgrade to unlock more features'
                      : 'You have access to all features'}
                  </p>
                </div>
                <Link to="/admin/billing">
                  <Button variant="outline" size="sm">
                    Manage Plan
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Frequently used administrative tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/admin/users/new">
              <Card className="hover:border-primary-300 transition-colors cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                  <p className="font-medium">Add User</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/admin/courses/new">
              <Card className="hover:border-primary-300 transition-colors cursor-pointer">
                <CardContent className="p-6 text-center">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                  <p className="font-medium">Create Course</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/admin/enrollments">
              <Card className="hover:border-primary-300 transition-colors cursor-pointer">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                  <p className="font-medium">Manage Enrollments</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/admin/reports">
              <Card className="hover:border-primary-300 transition-colors cursor-pointer">
                <CardContent className="p-6 text-center">
                  <DollarSign className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                  <p className="font-medium">View Reports</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
