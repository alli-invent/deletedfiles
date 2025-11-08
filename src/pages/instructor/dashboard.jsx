import React, { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { 
  BookOpen, 
  Users, 
  BarChart3, 
  TrendingUp,
  Calendar,
  MessageSquare,
  FileText,
  Clock,
  Award
} from 'lucide-react'

export default function InstructorDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({})
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalCourses: 8,
        totalStudents: 245,
        averageRating: 4.8,
        assignmentsGraded: 12,
        pendingReviews: 3,
        revenue: 12500
      })

      setRecentActivity([
        {
          id: 1,
          type: 'assignment',
          course: 'Mathematics 101',
          student: 'John Doe',
          action: 'submitted assignment',
          time: '2 hours ago',
          status: 'pending'
        },
        {
          id: 2,
          type: 'enrollment',
          course: 'Science Fundamentals',
          student: 'Sarah Wilson',
          action: 'enrolled in course',
          time: '5 hours ago',
          status: 'completed'
        },
        {
          id: 3,
          type: 'question',
          course: 'Web Development',
          student: 'Mike Johnson',
          action: 'asked a question',
          time: '1 day ago',
          status: 'pending'
        },
        {
          id: 4,
          type: 'completion',
          course: 'Mathematics 101',
          student: 'Emily Chen',
          action: 'completed course',
          time: '2 days ago',
          status: 'completed'
        }
      ])
      setLoading(false)
    }, 1000)
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'assignment':
        return <FileText className="h-4 w-4" />
      case 'enrollment':
        return <Users className="h-4 w-4" />
      case 'question':
        return <MessageSquare className="h-4 w-4" />
      case 'completion':
        return <Award className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status) => {
    return status === 'pending' 
      ? <Badge variant="warning">Pending</Badge>
      : <Badge variant="success">Completed</Badge>
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Instructor Dashboard</h1>
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your courses today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              +15 this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating}/5.0</div>
            <p className="text-xs text-muted-foreground">
              Based on 189 reviews
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReviews}</div>
            <p className="text-xs text-muted-foreground">
              Needs attention
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates from your courses and students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center space-x-4 p-3 border rounded-lg"
                >
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {activity.student} {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.course} • {activity.time}
                    </p>
                  </div>
                  <div>
                    {getStatusBadge(activity.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <BookOpen className="h-4 w-4 mr-2" />
              Create New Course
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Grade Assignments
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              Answer Questions
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Manage Students
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Course Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Course Performance</CardTitle>
          <CardDescription>
            Overview of your courses' engagement and completion rates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'Mathematics 101', students: 85, completion: 78, rating: 4.8 },
              { name: 'Science Fundamentals', students: 64, completion: 82, rating: 4.9 },
              { name: 'Web Development', students: 45, completion: 65, rating: 4.7 },
              { name: 'English Literature', students: 32, completion: 71, rating: 4.6 }
            ].map((course, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold">{course.name}</h4>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>{course.students} students</span>
                    <span>{course.completion}% completion</span>
                    <span>⭐ {course.rating}</span>
                  </div>
                </div>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${course.completion}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}