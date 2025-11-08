import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { assessmentService } from '../../services/assessment-service'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { 
  Plus,
  Save,
  Eye,
  FileText,
  Clock,
  Users,
  BarChart3,
  Edit,
  Trash2
} from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import AssessmentForm from '../../components/forms/assessment-form'

export default function AssessmentBuilder() {
  const { id } = useParams()
  const [assessments, setAssessments] = useState([])
  const [loading, setLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editingAssessment, setEditingAssessment] = useState(null)

  useEffect(() => {
    loadAssessments()
  }, [])

  const loadAssessments = async () => {
    try {
      const assessmentsData = await assessmentService.getAssessments()
      setAssessments(assessmentsData)
    } catch (error) {
      console.error('Error loading assessments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAssessment = async (assessmentData) => {
    try {
      await assessmentService.createAssessment(assessmentData)
      await loadAssessments()
      setCreateDialogOpen(false)
    } catch (error) {
      console.error('Error creating assessment:', error)
    }
  }

  const handleUpdateAssessment = async (assessmentData) => {
    try {
      await assessmentService.updateAssessment(editingAssessment.id, assessmentData)
      await loadAssessments()
      setEditingAssessment(null)
    } catch (error) {
      console.error('Error updating assessment:', error)
    }
  }

  const handleDeleteAssessment = async (assessmentId) => {
    if (window.confirm('Are you sure you want to delete this assessment?')) {
      try {
        await assessmentService.deleteAssessment(assessmentId)
        await loadAssessments()
      } catch (error) {
        console.error('Error deleting assessment:', error)
      }
    }
  }

  const getTypeBadge = (type) => {
    const variants = {
      quiz: 'secondary',
      exam: 'destructive',
      assignment: 'default'
    }
    return <Badge variant={variants[type]}>{type}</Badge>
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Assessment Builder</h1>
          <p className="text-muted-foreground">Loading assessments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Assessment Builder</h1>
          <p className="text-muted-foreground">
            Create and manage quizzes, exams, and assignments
          </p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Assessment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Assessment</DialogTitle>
              <DialogDescription>
                Build a new quiz, exam, or assignment for your students
              </DialogDescription>
            </DialogHeader>
            <AssessmentForm
              onSubmit={handleCreateAssessment}
              onCancel={() => setCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Assessments Grid */}
      {assessments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No assessments found</h3>
            <p className="text-muted-foreground mb-4">
              Create your first assessment to get started.
            </p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Assessment
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assessments.map((assessment) => (
            <Card key={assessment.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  {getTypeBadge(assessment.type)}
                  <Badge variant="outline">
                    {assessment.questions?.length || 0} Qs
                  </Badge>
                </div>
                <CardTitle className="text-lg">{assessment.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {assessment.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{assessment.duration} min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{assessment.passing_score}% to pass</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Attempts: {assessment.max_attempts}</span>
                    <span>Course: {assessment.course_name}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <BarChart3 className="h-4 w-4" />
                    <span>Avg: {assessment.average_score || 'N/A'}%</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingAssessment(assessment)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteAssessment(assessment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Assessment Dialog */}
      <Dialog open={!!editingAssessment} onOpenChange={() => setEditingAssessment(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Assessment</DialogTitle>
            <DialogDescription>
              Update assessment details and questions
            </DialogDescription>
          </DialogHeader>
          {editingAssessment && (
            <AssessmentForm
              assessment={editingAssessment}
              onSubmit={handleUpdateAssessment}
              onCancel={() => setEditingAssessment(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}