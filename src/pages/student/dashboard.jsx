import React from 'react'
import { useAuth } from '../../hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { BookOpen, Calendar, Award, BarChart3 } from 'lucide-react'

export default function StudentDashboard() {
  const { user } = useAuth()

  const stats = [
    { label: 'Enrolled Courses', value: '5', icon: BookOpen, color: 'blue' },
    { label: 'Assignments Due', value: '3', icon: Calendar, color: 'orange' },
    { label: 'Certificates', value: '2', icon: Award, color: 'green' },
    { label: 'Overall Progress', value: '75%', icon: BarChart3, color: 'purple' },
  ]

  const recentCourses = [
    { id: 1, name: 'Mathematics 101', progress: 80, nextAssignment: 'Quiz 3' },
    { id: 2, name: 'Science Fundamentals', progress: 65, nextAssignment: 'Lab Report' },
    { id: 3, name: 'English Literature', progress: 45, nextAssignment: 'Essay' },
  ]

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
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.label}
              </CardTitle>
              <stat.icon className={`h-4 w-4 text-${stat.color}-500`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Courses */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Courses</CardTitle>
            <CardDescription>
              Continue your learning journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentCourses.map((course) => (
              <div key={course.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-semibold">{course.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Next: {course.nextAssignment}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{course.progress}%</div>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              View All Courses
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Assignments */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Assignments</CardTitle>
            <CardDescription>
              Due in the next 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">Mathematics Quiz 3</h4>
                    <p className="text-sm text-muted-foreground">Mathematics 101</p>
                  </div>
                  <span className="text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded">
                    Due Tomorrow
                  </span>
                </div>
              </div>

              <div className="p-3 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">Science Lab Report</h4>
                    <p className="text-sm text-muted-foreground">Science Fundamentals</p>
                  </div>
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Due in 3 days
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
