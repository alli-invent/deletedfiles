import React, { useState, useEffect } from 'react'
import { enrollmentService } from '../../services/enrollment-service'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import {
  Search,
  Filter,
  User,
  BookOpen,
  Calendar,
  CheckCircle,
  XCircle,
  MoreVertical
} from 'lucide-react'

export default function EnrollmentManagement() {
  const [enrollments, setEnrollments] = useState([])
  const [filteredEnrollments, setFilteredEnrollments] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [courseFilter, setCourseFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEnrollments()
  }, [])

  useEffect(() => {
    filterEnrollments()
  }, [enrollments, searchTerm, statusFilter, courseFilter])

  const loadEnrollments = async () => {
    try {
      const enrollmentsData = await enrollmentService.getEnrollments()
      setEnrollments(enrollmentsData)
    } catch (error) {
      console.error('Error loading enrollments:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterEnrollments = () => {
    let filtered = enrollments

    if (searchTerm) {
      filtered = filtered.filter(enrollment =>
        enrollment.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.course_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(enrollment => enrollment.status === statusFilter)
    }

    if (courseFilter !== 'all') {
      filtered = filtered.filter(enrollment => enrollment.course_name === courseFilter)
    }

    setFilteredEnrollments(filtered)
  }

  const updateEnrollmentStatus = async (enrollmentId, status) => {
    try {
      await enrollmentService.updateEnrollment(enrollmentId, { status })
      await loadEnrollments()
    } catch (error) {
      console.error('Error updating enrollment:', error)
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      active: 'success',
      completed: 'default',
      dropped: 'destructive',
      suspended: 'warning'
    }
    return <Badge variant={variants[status]}>{status}</Badge>
  }

  const courses = [...new Set(enrollments.map(enrollment => enrollment.course_name))]

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Enrollment Management</h1>
          <p className="text-muted-foreground">Loading enrollments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Enrollment Management</h1>
          <p className="text-muted-foreground">
            Manage student course enrollments
          </p>
        </div>
        <Button variant="outline">
          Export Report
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search enrollments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="dropped">Dropped</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Course</label>
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="all">All Courses</option>
                {courses.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Quick Stats</label>
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-muted-foreground">Total:</span>
                <span className="font-semibold">{enrollments.length}</span>
                <span className="text-muted-foreground">Active:</span>
                <span className="font-semibold text-green-600">
                  {enrollments.filter(e => e.status === 'active').length}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enrollments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Enrollments</CardTitle>
          <CardDescription>
            {filteredEnrollments.length} enrollments found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 font-medium">Student</th>
                  <th className="text-left py-3 font-medium">Course</th>
                  <th className="text-left py-3 font-medium">Institution</th>
                  <th className="text-left py-3 font-medium">Enrolled</th>
                  <th className="text-left py-3 font-medium">Progress</th>
                  <th className="text-left py-3 font-medium">Status</th>
                  <th className="text-right py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEnrollments.map((enrollment) => (
                  <tr key={enrollment.id} className="border-b hover:bg-muted/50">
                    <td className="py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{enrollment.student_name}</div>
                          <div className="text-xs text-muted-foreground">{enrollment.student_email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span>{enrollment.course_name}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      {enrollment.institution}
                    </td>
                    <td className="py-3">
                      {new Date(enrollment.enrolled_at).toLocaleDateString()}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${enrollment.progress || 0}%` }}
                          />
                        </div>
                        <span className="text-xs">{enrollment.progress || 0}%</span>
                      </div>
                    </td>
                    <td className="py-3">
                      {getStatusBadge(enrollment.status)}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        {enrollment.status === 'active' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateEnrollmentStatus(enrollment.id, 'completed')}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateEnrollmentStatus(enrollment.id, 'suspended')}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredEnrollments.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No enrollments found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enrollment Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrollments.length}</div>
            <p className="text-xs text-muted-foreground">
              All time enrollments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {enrollments.filter(e => e.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((enrollments.filter(e => e.status === 'completed').length / enrollments.length) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(enrollments.reduce((acc, e) => acc + (e.progress || 0), 0) / enrollments.length)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Average course progress
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
