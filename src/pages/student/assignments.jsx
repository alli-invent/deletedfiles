import React, { useState, useEffect } from 'react'
import { assessmentService } from '../../services/assessment-service'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { 
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  BookOpen
} from 'lucide-react'

export default function Assignments() {
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAssignments()
  }, [])

  const loadAssignments = async () => {
    try {
      // This would typically come from the user context
      const studentId = 'current-user-id'
      const assignmentsData = await assessmentService.getStudentAssessments(studentId)
      setAssignments(assignmentsData)
    } catch (error) {
      console.error('Error loading assignments:', error)
    } finally {
      setLoading(false)
    }
  }

  const pendingAssignments = assignments.filter(a => a.status === 'assigned')
  const submittedAssignments = assignments.filter(a => a.status === 'submitted')
  const gradedAssignments = assignments.filter(a => a.status === 'graded')

  const getStatusBadge = (assignment) => {
    const now = new Date()
    const dueDate = new Date(assignment.due_date)
    
    if (assignment.status === 'graded') {
      return <Badge variant="success">Graded</Badge>
    }
    
    if (assignment.status === 'submitted') {
      return <Badge variant="secondary">Submitted</Badge>
    }
    
    if (now > dueDate) {
      return <Badge variant="destructive">Overdue</Badge>
    }
    
    const daysUntilDue = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24))
    if (daysUntilDue <= 2) {
      return <Badge variant="warning">Due Soon</Badge>
    }
    
    return <Badge variant="outline">Pending</Badge>
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Assignments</h1>
          <p className="text-muted-foreground">Loading your assignments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Assignments</h1>
        <p className="text-muted-foreground">
          Track and submit your course assignments
        </p>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">
            Pending ({pendingAssignments.length})
          </TabsTrigger>
          <TabsTrigger value="submitted">
            Submitted ({submittedAssignments.length})
          </TabsTrigger>
          <TabsTrigger value="graded">
            Graded ({gradedAssignments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingAssignments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No pending assignments</h3>
                <p className="text-muted-foreground">
                  You're all caught up! No assignments due at the moment.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingAssignments.map((assignment) => (
                <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center space-x-2">
                          <FileText className="h-5 w-5" />
                          <span>{assignment.title}</span>
                        </CardTitle>
                        <CardDescription>
                          {assignment.course_name} • {assignment.type}
                        </CardDescription>
                      </div>
                      {getStatusBadge(assignment)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          Due: {new Date(assignment.due_date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {assignment.duration} minutes
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {assignment.max_attempts} attempt{assignment.max_attempts > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex space-x-2">
                      <Button>
                        Start Assignment
                      </Button>
                      <Button variant="outline">
                        View Instructions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="submitted" className="space-y-4">
          {submittedAssignments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No submitted assignments</h3>
                <p className="text-muted-foreground">
                  Assignments you submit will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {submittedAssignments.map((assignment) => (
                <Card key={assignment.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle>{assignment.title}</CardTitle>
                        <CardDescription>
                          {assignment.course_name} • Submitted on {new Date(assignment.submitted_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">Under Review</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Submitted {new Date(assignment.submitted_at).toLocaleDateString()}</span>
                      </div>
                      <Button variant="outline" size="sm">
                        View Submission
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="graded" className="space-y-4">
          {gradedAssignments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No graded assignments</h3>
                <p className="text-muted-foreground">
                  Graded assignments will appear here once reviewed by your instructor.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {gradedAssignments.map((assignment) => (
                <Card key={assignment.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle>{assignment.title}</CardTitle>
                        <CardDescription>
                          {assignment.course_name} • Graded on {new Date(assignment.graded_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {assignment.score}%
                        </div>
                        <Badge variant={
                          assignment.score >= assignment.passing_score ? 'success' : 'destructive'
                        }>
                          {assignment.score >= assignment.passing_score ? 'Passed' : 'Failed'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Instructor Feedback:</span>
                        <span>{assignment.feedback || 'No feedback provided'}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          Download Certificate
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}