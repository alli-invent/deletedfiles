import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { 
  Search,
  Filter,
  Download,
  Mail,
  User,
  BookOpen,
  BarChart3,
  CheckCircle,
  XCircle
} from 'lucide-react'

export default function Gradebook() {
  const [students, setStudents] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGradebook()
  }, [])

  useEffect(() => {
    filterStudents()
  }, [students, searchTerm, selectedCourse])

  const loadGradebook = async () => {
    // Simulate API call
    setTimeout(() => {
      setStudents([
        {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@student.edu',
          course: 'Mathematics 101',
          assignments: [
            { name: 'Quiz 1', score: 90, max_score: 100, submitted: true },
            { name: 'Quiz 2', score: 85, max_score: 100, submitted: true },
            { name: 'Midterm', score: 80, max_score: 100, submitted: true },
            { name: 'Final Project', score: null, max_score: 100, submitted: false }
          ],
          overall_grade: 85
        },
        {
          id: 2,
          name: 'Sarah Wilson',
          email: 'sarah.wilson@student.edu',
          course: 'Mathematics 101',
          assignments: [
            { name: 'Quiz 1', score: 95, max_score: 100, submitted: true },
            { name: 'Quiz 2', score: 92, max_score: 100, submitted: true },
            { name: 'Midterm', score: 88, max_score: 100, submitted: true },
            { name: 'Final Project', score: 90, max_score: 100, submitted: true }
          ],
          overall_grade: 91
        },
        {
          id: 3,
          name: 'Mike Johnson',
          email: 'mike.johnson@student.edu',
          course: 'Science Fundamentals',
          assignments: [
            { name: 'Lab Report 1', score: 85, max_score: 100, submitted: true },
            { name: 'Lab Report 2', score: 78, max_score: 100, submitted: true },
            { name: 'Research Paper', score: null, max_score: 100, submitted: false }
          ],
          overall_grade: 82
        }
      ])
      setLoading(false)
    }, 1000)
  }

  const filterStudents = () => {
    let filtered = students

    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCourse !== 'all') {
      filtered = filtered.filter(student => student.course === selectedCourse)
    }

    setFilteredStudents(filtered)
  }

  const courses = [...new Set(students.map(student => student.course))]

  const getGradeColor = (grade) => {
    if (grade >= 90) return 'text-green-600'
    if (grade >= 80) return 'text-blue-600'
    if (grade >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getGradeBadge = (grade) => {
    if (grade >= 90) return <Badge variant="success">A</Badge>
    if (grade >= 80) return <Badge variant="default">B</Badge>
    if (grade >= 70) return <Badge variant="warning">C</Badge>
    if (grade >= 60) return <Badge variant="destructive">D</Badge>
    return <Badge variant="destructive">F</Badge>
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gradebook</h1>
          <p className="text-muted-foreground">Loading gradebook data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gradebook</h1>
          <p className="text-muted-foreground">
            Manage student grades and track academic performance
          </p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Grades
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="all">All Courses</option>
          {courses.map(course => (
            <option key={course} value={course}>{course}</option>
          ))}
        </select>
      </div>

      {/* Gradebook Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Grades</CardTitle>
          <CardDescription>
            View and manage student assignments and overall grades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 font-medium">Student</th>
                  <th className="text-left py-3 font-medium">Course</th>
                  {students[0]?.assignments.map((assignment, index) => (
                    <th key={index} className="text-center py-3 font-medium">
                      {assignment.name}
                    </th>
                  ))}
                  <th className="text-center py-3 font-medium">Overall</th>
                  <th className="text-center py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-muted/50">
                    <td className="py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-xs text-muted-foreground">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <Badge variant="outline">{student.course}</Badge>
                    </td>
                    {student.assignments.map((assignment, index) => (
                      <td key={index} className="py-3 text-center">
                        {assignment.submitted ? (
                          assignment.score !== null ? (
                            <div className="flex items-center justify-center space-x-1">
                              <span className={getGradeColor(assignment.score)}>
                                {assignment.score}%
                              </span>
                              <CheckCircle className="h-3 w-3 text-green-500" />
                            </div>
                          ) : (
                            <Button variant="outline" size="sm">
                              Grade
                            </Button>
                          )
                        ) : (
                          <div className="flex items-center justify-center space-x-1 text-muted-foreground">
                            <XCircle className="h-3 w-3" />
                            <span>Missing</span>
                          </div>
                        )}
                      </td>
                    ))}
                    <td className="py-3 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <span className={`font-semibold ${getGradeColor(student.overall_grade)}`}>
                          {student.overall_grade}%
                        </span>
                        {getGradeBadge(student.overall_grade)}
                      </div>
                    </td>
                    <td className="py-3 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Button variant="ghost" size="sm">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No students found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(students.reduce((acc, student) => acc + student.overall_grade, 0) / students.length)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Class average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground">
              Enrolled students
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assignments Due</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {students.reduce((acc, student) => 
                acc + student.assignments.filter(a => !a.submitted).length, 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Pending submissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((students.filter(s => s.overall_grade >= 70).length / students.length) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Students passing
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}