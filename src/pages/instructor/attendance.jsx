import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import {
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Filter,
  Search,
  User
} from 'lucide-react'

export default function Attendance() {
  const [attendance, setAttendance] = useState([])
  const [filteredAttendance, setFilteredAttendance] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedCourse, setSelectedCourse] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAttendance()
  }, [])

  useEffect(() => {
    filterAttendance()
  }, [attendance, searchTerm, selectedDate, selectedCourse])

  const loadAttendance = async () => {
    // Simulate API call
    setTimeout(() => {
      setAttendance([
        {
          id: 1,
          student_name: 'John Doe',
          student_email: 'john.doe@student.edu',
          course: 'Mathematics 101',
          date: '2024-01-15',
          status: 'present',
          check_in: '09:00 AM',
          check_out: '11:00 AM'
        },
        {
          id: 2,
          student_name: 'Sarah Wilson',
          student_email: 'sarah.wilson@student.edu',
          course: 'Mathematics 101',
          date: '2024-01-15',
          status: 'present',
          check_in: '08:55 AM',
          check_out: '11:05 AM'
        },
        {
          id: 3,
          student_name: 'Mike Johnson',
          student_email: 'mike.johnson@student.edu',
          course: 'Mathematics 101',
          date: '2024-01-15',
          status: 'absent',
          check_in: null,
          check_out: null
        },
        {
          id: 4,
          student_name: 'Emily Chen',
          student_email: 'emily.chen@student.edu',
          course: 'Science Fundamentals',
          date: '2024-01-15',
          status: 'late',
          check_in: '09:25 AM',
          check_out: '11:00 AM'
        }
      ])
      setLoading(false)
    }, 1000)
  }

  const filterAttendance = () => {
    let filtered = attendance

    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.student_email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedDate) {
      filtered = filtered.filter(record => record.date === selectedDate)
    }

    if (selectedCourse !== 'all') {
      filtered = filtered.filter(record => record.course === selectedCourse)
    }

    setFilteredAttendance(filtered)
  }

  const markAttendance = (recordId, status) => {
    setAttendance(attendance.map(record =>
      record.id === recordId ? { ...record, status } : record
    ))
  }

  const getStatusBadge = (status) => {
    const variants = {
      present: 'success',
      absent: 'destructive',
      late: 'warning'
    }
    return <Badge variant={variants[status]}>{status}</Badge>
  }

  const courses = [...new Set(attendance.map(record => record.course))]
  const todayStats = {
    present: attendance.filter(r => r.date === selectedDate && r.status === 'present').length,
    absent: attendance.filter(r => r.date === selectedDate && r.status === 'absent').length,
    late: attendance.filter(r => r.date === selectedDate && r.status === 'late').length,
    total: attendance.filter(r => r.date === selectedDate).length
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Attendance</h1>
          <p className="text-muted-foreground">Loading attendance data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Attendance</h1>
          <p className="text-muted-foreground">
            Track and manage student attendance
          </p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.present}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((todayStats.present / todayStats.total) * 100)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.absent}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((todayStats.absent / todayStats.total) * 100)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Late</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.late}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((todayStats.late / todayStats.total) * 100)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.total}</div>
            <p className="text-xs text-muted-foreground">
              Students for {new Date(selectedDate).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
          <CardDescription>
            View and manage student attendance for your courses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Course</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="all">All Courses</option>
                {courses.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Students</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 font-medium">Student</th>
                  <th className="text-left py-3 font-medium">Course</th>
                  <th className="text-center py-3 font-medium">Date</th>
                  <th className="text-center py-3 font-medium">Check In</th>
                  <th className="text-center py-3 font-medium">Check Out</th>
                  <th className="text-center py-3 font-medium">Status</th>
                  <th className="text-center py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.map((record) => (
                  <tr key={record.id} className="border-b hover:bg-muted/50">
                    <td className="py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{record.student_name}</div>
                          <div className="text-xs text-muted-foreground">{record.student_email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <Badge variant="outline">{record.course}</Badge>
                    </td>
                    <td className="py-3 text-center">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-center">
                      {record.check_in || '-'}
                    </td>
                    <td className="py-3 text-center">
                      {record.check_out || '-'}
                    </td>
                    <td className="py-3 text-center">
                      {getStatusBadge(record.status)}
                    </td>
                    <td className="py-3 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAttendance(record.id, 'present')}
                          className={record.status === 'present' ? 'bg-green-50 text-green-700' : ''}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAttendance(record.id, 'absent')}
                          className={record.status === 'absent' ? 'bg-red-50 text-red-700' : ''}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAttendance(record.id, 'late')}
                          className={record.status === 'late' ? 'bg-yellow-50 text-yellow-700' : ''}
                        >
                          <Clock className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAttendance.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No attendance records found for the selected criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common attendance management tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button>
              <Calendar className="h-4 w-4 mr-2" />
              Take Attendance for Today
            </Button>
            <Button variant="outline">
              Generate Monthly Report
            </Button>
            <Button variant="outline">
              Send Absence Notifications
            </Button>
            <Button variant="outline">
              View Attendance History
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
