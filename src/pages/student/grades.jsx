import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { 
  BarChart3,
  TrendingUp,
  Award,
  BookOpen,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

export default function Grades() {
  const [grades, setGrades] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading grades data
    setTimeout(() => {
      setGrades([
        {
          id: 1,
          course_name: 'Mathematics 101',
          instructor: 'Dr. Smith',
          overall_grade: 85,
          assignments: [
            { name: 'Quiz 1', score: 90, max_score: 100, weight: 10 },
            { name: 'Quiz 2', score: 85, max_score: 100, weight: 10 },
            { name: 'Midterm Exam', score: 80, max_score: 100, weight: 30 },
            { name: 'Final Project', score: 85, max_score: 100, weight: 50 }
          ]
        },
        {
          id: 2,
          course_name: 'Science Fundamentals',
          instructor: 'Prof. Johnson',
          overall_grade: 92,
          assignments: [
            { name: 'Lab Report 1', score: 95, max_score: 100, weight: 20 },
            { name: 'Lab Report 2', score: 90, max_score: 100, weight: 20 },
            { name: 'Research Paper', score: 88, max_score: 100, weight: 60 }
          ]
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

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
          <h1 className="text-3xl font-bold">Grades</h1>
          <p className="text-muted-foreground">Loading your grades...</p>
        </div>
      </div>
    )
  }

  const overallGPA = grades.reduce((acc, course) => acc + course.overall_grade, 0) / grades.length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Grades</h1>
        <p className="text-muted-foreground">
          Track your academic performance and progress
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall GPA</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallGPA.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {overallGPA >= 80 ? 'Excellent work!' : 'Keep pushing!'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{grades.length}</div>
            <p className="text-xs text-muted-foreground">
              Active courses this semester
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trend</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+5%</div>
            <p className="text-xs text-muted-foreground">
              Improvement from last semester
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Course Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed View</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {grades.map((course) => (
              <Card key={course.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{course.course_name}</CardTitle>
                      <CardDescription>
                        Instructor: {course.instructor}
                      </CardDescription>
                    </div>
                    {getGradeBadge(course.overall_grade)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Overall Grade</span>
                      <span className={`text-lg font-bold ${getGradeColor(course.overall_grade)}`}>
                        {course.overall_grade}%
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Assignments</span>
                        <span>{course.assignments.length} completed</span>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all" 
                          style={{ width: `${course.overall_grade}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Badge variant="outline" className="flex items-center space-x-1">
                        <CheckCircle className="h-3 w-3" />
                        <span>
                          {course.assignments.filter(a => a.score >= 70).length} Passed
                        </span>
                      </Badge>
                      <Badge variant="outline" className="flex items-center space-x-1">
                        <Award className="h-3 w-3" />
                        <span>Top {course.overall_grade >= 90 ? '10%' : '25%'}</span>
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6">
          {grades.map((course) => (
            <Card key={course.id}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>{course.course_name}</span>
                </CardTitle>
                <CardDescription>
                  Detailed breakdown of assignments and grades
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm font-medium">
                    <div>Assignment</div>
                    <div className="text-right">Score</div>
                    <div className="text-right">Weight</div>
                    <div className="text-right">Status</div>
                  </div>
                  
                  {course.assignments.map((assignment, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 md:grid-cols-4 gap-4 py-3 border-t"
                    >
                      <div className="flex items-center space-x-2">
                        {assignment.score >= 70 ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span>{assignment.name}</span>
                      </div>
                      <div className="text-right">
                        <span className={getGradeColor(assignment.score)}>
                          {assignment.score}%
                        </span>
                      </div>
                      <div className="text-right text-muted-foreground">
                        {assignment.weight}%
                      </div>
                      <div className="text-right">
                        <Badge variant={
                          assignment.score >= 70 ? 'success' : 'destructive'
                        }>
                          {assignment.score >= 70 ? 'Passed' : 'Review'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-3 border-t font-bold">
                    <div>Overall Grade</div>
                    <div className={`text-right ${getGradeColor(course.overall_grade)}`}>
                      {course.overall_grade}%
                    </div>
                    <div className="text-right">100%</div>
                    <div className="text-right">
                      {getGradeBadge(course.overall_grade)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}