import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/auth-context';
import { useFeatures } from '../../hooks/use-features';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import {
  BookOpen,
  Clock,
  Award,
  Calendar,
  ArrowRight,
  PlayCircle
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { getUsage } = useFeatures();

  // Mock data - in real app, this would come from API
  const enrollments = [
    {
      id: '1',
      course: {
        title: 'Introduction to Web Development',
        code: 'WEB101',
        instructor: 'John Smith',
        progress: 65,
      },
      nextSession: '2024-01-15T10:00:00Z',
      status: 'active',
    },
    {
      id: '2',
      course: {
        title: 'Data Science Fundamentals',
        code: 'DS201',
        instructor: 'Sarah Johnson',
        progress: 30,
      },
      nextSession: null,
      status: 'active',
    },
  ];

  const upcomingAssignments = [
    {
      id: '1',
      title: 'React Component Project',
      course: 'WEB101',
      dueDate: '2024-01-20T23:59:00Z',
      type: 'project',
    },
    {
      id: '2',
      title: 'Data Analysis Quiz',
      course: 'DS201',
      dueDate: '2024-01-18T23:59:00Z',
      type: 'quiz',
    },
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getDaysUntilDue = (dueDate) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.full_name}!
        </h1>
        <p className="text-primary-100 text-lg">
          Continue your learning journey and achieve your goals
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">2</p>
                <p className="text-gray-600">Active Courses</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">47%</p>
                <p className="text-gray-600">Average Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mr-4">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">12h</p>
                <p className="text-gray-600">Study Time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">2</p>
                <p className="text-gray-600">Upcoming</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Active Courses
            </CardTitle>
            <CardDescription>
              Continue learning from where you left off
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {enrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {enrollment.course.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {enrollment.course.code} • {enrollment.course.instructor}
                      </p>
                    </div>
                    <Badge variant={enrollment.status === 'active' ? 'default' : 'secondary'}>
                      {enrollment.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{enrollment.course.progress}%</span>
                    </div>
                    <Progress value={enrollment.course.progress} className="h-2" />
                  </div>

                  <div className="flex justify-between items-center">
                    {enrollment.nextSession && (
                      <div className="text-sm text-gray-600">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Next: {formatDate(enrollment.nextSession)}
                      </div>
                    )}
                    <Link to={`/student/courses/${enrollment.id}`}>
                      <Button size="sm">
                        <PlayCircle className="w-4 h-4 mr-1" />
                        Continue
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <Link to="/student/courses">
                <Button variant="outline" className="w-full">
                  View All Courses
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Assignments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Upcoming Assignments
            </CardTitle>
            <CardDescription>
              Deadlines and tasks requiring your attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAssignments.map((assignment) => {
                const daysUntilDue = getDaysUntilDue(assignment.dueDate);
                const isUrgent = daysUntilDue <= 2;
                const isWarning = daysUntilDue <= 5;

                return (
                  <div
                    key={assignment.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{assignment.title}</h3>
                      <Badge
                        variant={
                          isUrgent
                            ? 'destructive'
                            : isWarning
                            ? 'warning'
                            : 'secondary'
                        }
                      >
                        {daysUntilDue === 0
                          ? 'Due Today'
                          : daysUntilDue === 1
                          ? 'Due Tomorrow'
                          : `Due in ${daysUntilDue} days`}
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">
                      {assignment.course} • {assignment.type}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Due: {formatDate(assignment.dueDate)}
                      </span>
                      <Button size="sm" variant="outline">
                        Start
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {upcomingAssignments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No upcoming assignments</p>
                <p className="text-sm">You're all caught up!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
