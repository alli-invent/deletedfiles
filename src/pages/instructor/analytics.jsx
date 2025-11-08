import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import {
  BarChart3,
  Users,
  BookOpen,
  TrendingUp,
  Award,
  Clock,
  Download,
  Calendar
} from 'lucide-react'

export default function Analytics() {
  const [analytics, setAnalytics] = useState({})
  const [timeRange, setTimeRange] = useState('30days')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = async () => {
    // Simulate API call
    setTimeout(() => {
      setAnalytics({
        overview: {
          totalStudents: 245,
          activeStudents: 198,
          courseCompletion: 78,
          averageGrade: 84
        },
        enrollmentTrend: [
          { month: 'Jan', students: 45 },
          { month: 'Feb', students: 52 },
          { month: 'Mar', students: 48 },
          { month: 'Apr', students: 65 },
          { month: 'May', students: 58 },
          { month: 'Jun', students: 72 }
        ],
        coursePerformance: [
          { name: 'Mathematics 101', students: 85, completion: 78, rating: 4.8 },
          { name: 'Science Fundamentals', students: 64, completion: 82, rating: 4.9 },
          { name: 'Web Development', students: 45, completion: 65, rating: 4.7 },
          { name: 'English Literature', students: 32, completion: 71, rating: 4.6 }
        ],
        studentEngagement: {
          averageTimeSpent: '2.5 hours/day',
          assignmentSubmission: 92,
          discussionParticipation: 78,
          videoCompletion: 85
        },
        revenue: {
          total: 12500,
          monthly: 2100,
          growth: 15
        }
      })
      setLoading(false)
    }, 1000)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Loading analytics data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            Insights into your courses and student performance
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="1year">Last year</option>
          </select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.activeStudents}</div>
            <p className="text-xs text-muted-foreground">
              Currently enrolled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.courseCompletion}%</div>
            <p className="text-xs text-muted-foreground">
              Course completion average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.averageGrade}%</div>
            <p className="text-xs text-muted-foreground">
              Student performance
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Course Performance</CardTitle>
            <CardDescription>
              Student engagement and completion rates by course
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.coursePerformance.map((course, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold">{course.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{course.students} students</span>
                      <span>⭐ {course.rating}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{course.completion}%</div>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${course.completion}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Student Engagement */}
        <Card>
          <CardHeader>
            <CardTitle>Student Engagement</CardTitle>
            <CardDescription>
              How students are interacting with your courses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-semibold">Average Time Spent</div>
                    <div className="text-sm text-muted-foreground">Per day per student</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {analytics.studentEngagement.averageTimeSpent}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-semibold">Assignment Submission</div>
                    <div className="text-sm text-muted-foreground">Rate of submission</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {analytics.studentEngagement.assignmentSubmission}%
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-purple-600" />
                  <div>
                    <div className="font-semibold">Discussion Participation</div>
                    <div className="text-sm text-muted-foreground">Active in forums</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  {analytics.studentEngagement.discussionParticipation}%
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Award className="h-5 w-5 text-orange-600" />
                  <div>
                    <div className="font-semibold">Video Completion</div>
                    <div className="text-sm text-muted-foreground">Course content watched</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-orange-600">
                  {analytics.studentEngagement.videoCompletion}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue and Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Enrollment Trend</CardTitle>
            <CardDescription>
              Student enrollment over the past 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.enrollmentTrend.map((month, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{month.month}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${(month.students / 80) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8">{month.students}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>
              Earnings and growth
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                ${analytics.revenue.total.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-xl font-semibold">${analytics.revenue.monthly}</div>
                <p className="text-xs text-muted-foreground">This Month</p>
              </div>
              <div>
                <div className="text-xl font-semibold text-green-600">
                  +{analytics.revenue.growth}%
                </div>
                <p className="text-xs text-muted-foreground">Growth</p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-semibold mb-2">Top Performing Courses</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Mathematics 101</span>
                  <span className="font-semibold">$4,200</span>
                </div>
                <div className="flex justify-between">
                  <span>Science Fundamentals</span>
                  <span className="font-semibold">$3,800</span>
                </div>
                <div className="flex justify-between">
                  <span>Web Development</span>
                  <span className="font-semibold">$2,900</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Key Performance Indicators</CardTitle>
          <CardDescription>
            Important metrics for your teaching performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">4.8/5.0</div>
              <p className="text-sm text-muted-foreground">Instructor Rating</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">94%</div>
              <p className="text-sm text-muted-foreground">Student Satisfaction</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">88%</div>
              <p className="text-sm text-muted-foreground">Course Retention</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">72%</div>
              <p className="text-sm text-muted-foreground">Referral Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
