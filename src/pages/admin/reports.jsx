import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import {
  Download,
  Calendar,
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  BarChart3,
  PieChart
} from 'lucide-react'

export default function Reports() {
  const [reports, setReports] = useState({})
  const [dateRange, setDateRange] = useState('30days')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReports()
  }, [dateRange])

  const loadReports = async () => {
    // Simulate API call
    setTimeout(() => {
      setReports({
        platformOverview: {
          totalUsers: 1250,
          activeInstitutions: 45,
          totalCourses: 320,
          totalEnrollments: 4520,
          monthlyRevenue: 45200,
          completionRate: 78
        },
        userGrowth: [
          { month: 'Jan', users: 850, growth: 5 },
          { month: 'Feb', users: 920, growth: 8 },
          { month: 'Mar', users: 980, growth: 6 },
          { month: 'Apr', users: 1050, growth: 7 },
          { month: 'May', users: 1120, growth: 7 },
          { month: 'Jun', users: 1250, growth: 12 }
        ],
        revenueData: [
          { month: 'Jan', revenue: 38500 },
          { month: 'Feb', revenue: 41200 },
          { month: 'Mar', revenue: 39800 },
          { month: 'Apr', revenue: 42500 },
          { month: 'May', revenue: 43800 },
          { month: 'Jun', revenue: 45200 }
        ],
        courseDistribution: [
          { category: 'Technology', courses: 120, percentage: 37.5 },
          { category: 'Science', courses: 85, percentage: 26.6 },
          { category: 'Business', courses: 65, percentage: 20.3 },
          { category: 'Arts', courses: 35, percentage: 10.9 },
          { category: 'Other', courses: 15, percentage: 4.7 }
        ],
        institutionPerformance: [
          { name: 'Tech University', students: 850, courses: 45, revenue: 12500 },
          { name: 'Science College', students: 620, courses: 32, revenue: 9800 },
          { name: 'Business School', students: 450, courses: 28, revenue: 7200 },
          { name: 'Arts Institute', students: 320, courses: 18, revenue: 4800 },
          { name: 'Other Institutions', students: 2280, courses: 197, revenue: 10900 }
        ]
      })
      setLoading(false)
    }, 1000)
  }

  const exportReport = (type) => {
    console.log(`Exporting ${type} report...`)
    // In real app, this would generate and download a report
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Loading reports...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive platform analytics and insights
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="1year">Last year</option>
          </select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {/* Platform Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.platformOverview.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Institutions</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.platformOverview.activeInstitutions}</div>
            <p className="text-xs text-muted-foreground">
              +3 new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${reports.platformOverview.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +18% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.platformOverview.completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Course completion average
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth */}
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>
              Platform user growth over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.userGrowth.map((month, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium w-12">{month.month}</span>
                  <div className="flex items-center space-x-2 flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-primary h-3 rounded-full"
                        style={{ width: `${(month.users / 1500) * 100}%` }}
                      />
                    </div>
                    <div className="text-right w-20">
                      <span className="text-sm font-medium">{month.users}</span>
                      <span className="text-xs text-green-600 ml-1">+{month.growth}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
            <CardDescription>
              Monthly revenue performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.revenueData.map((month, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium w-12">{month.month}</span>
                  <div className="flex items-center space-x-2 flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full"
                        style={{ width: `${(month.revenue / 50000) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-20 text-right">
                      ${(month.revenue / 1000).toFixed(0)}k
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Course Distribution</CardTitle>
            <CardDescription>
              Courses by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.courseDistribution.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: [
                          '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'
                        ][index]
                      }}
                    />
                    <span className="text-sm font-medium">{category.category}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${category.percentage}%`,
                          backgroundColor: [
                            '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'
                          ][index]
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium w-12 text-right">
                      {category.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Institution Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Top Institutions</CardTitle>
            <CardDescription>
              Performance by institution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.institutionPerformance.map((institution, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-semibold">{institution.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {institution.students} students • {institution.courses} courses
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${institution.revenue.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Revenue</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Export Reports</CardTitle>
          <CardDescription>
            Generate detailed reports for different aspects of the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-24"
              onClick={() => exportReport('users')}
            >
              <Users className="h-6 w-6 mb-2" />
              <span>User Report</span>
            </Button>

            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-24"
              onClick={() => exportReport('revenue')}
            >
              <DollarSign className="h-6 w-6 mb-2" />
              <span>Revenue Report</span>
            </Button>

            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-24"
              onClick={() => exportReport('courses')}
            >
              <BookOpen className="h-6 w-6 mb-2" />
              <span>Course Report</span>
            </Button>

            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-24"
              onClick={() => exportReport('institutions')}
            >
              <BarChart3 className="h-6 w-6 mb-2" />
              <span>Institution Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
