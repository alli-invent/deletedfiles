import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { useToast } from '../../hooks/use-toast'
import { Plus, Trash2 } from 'lucide-react'

export default function AssessmentForm({ assessment, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'quiz',
    course_id: '',
    duration: 30,
    max_attempts: 1,
    passing_score: 70,
    questions: []
  })
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()

  useEffect(() => {
    if (assessment) {
      setFormData({
        title: assessment.title || '',
        description: assessment.description || '',
        type: assessment.type || 'quiz',
        course_id: assessment.course_id || '',
        duration: assessment.duration || 30,
        max_attempts: assessment.max_attempts || 1,
        passing_score: assessment.passing_score || 70,
        questions: assessment.questions || []
      })
    }
  }, [assessment])

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question: '',
          type: 'multiple_choice',
          options: ['', '', '', ''],
          correct_answer: 0,
          points: 1
        }
      ]
    }))
  }

  const updateQuestion = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === index ? { ...q, [field]: value } : q
      )
    }))
  }

  const removeQuestion = (index) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await onSubmit(formData)
      addToast({
        title: 'Success',
        description: assessment ? 'Assessment updated successfully' : 'Assessment created successfully',
        variant: 'default'
      })
    } catch (error) {
      addToast({
        title: 'Error',
        description: error.response?.data?.message || 'Something went wrong',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{assessment ? 'Edit Assessment' : 'Create New Assessment'}</CardTitle>
        <CardDescription>
          {assessment ? 'Update assessment details' : 'Create a new assessment for your course'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Assessment Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter assessment title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Assessment Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="exam">Exam</SelectItem>
                  <SelectItem value="assignment">Assignment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={formData.duration}
                onChange={(e) => handleChange('duration', parseInt(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_attempts">Maximum Attempts</Label>
              <Input
                id="max_attempts"
                type="number"
                min="1"
                value={formData.max_attempts}
                onChange={(e) => handleChange('max_attempts', parseInt(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passing_score">Passing Score (%)</Label>
              <Input
                id="passing_score"
                type="number"
                min="0"
                max="100"
                value={formData.passing_score}
                onChange={(e) => handleChange('passing_score', parseInt(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe the assessment and its requirements..."
              rows={3}
            />
          </div>

          {/* Questions Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Questions</Label>
              <Button type="button" variant="outline" size="sm" onClick={addQuestion}>
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>

            {formData.questions.map((question, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <h4 className="font-semibold">Question {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeQuestion(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Question Text</Label>
                    <Input
                      value={question.question}
                      onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                      placeholder="Enter question text"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Question Type</Label>
                      <Select
                        value={question.type}
                        onValueChange={(value) => updateQuestion(index, 'type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                          <SelectItem value="true_false">True/False</SelectItem>
                          <SelectItem value="short_answer">Short Answer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Points</Label>
                      <Input
                        type="number"
                        min="1"
                        value={question.points}
                        onChange={(e) => updateQuestion(index, 'points', parseInt(e.target.value))}
                        required
                      />
                    </div>
                  </div>

                  {question.type === 'multiple_choice' && (
                    <div className="space-y-2">
                      <Label>Options</Label>
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center space-x-2">
                          <Input
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...question.options]
                              newOptions[optIndex] = e.target.value
                              updateQuestion(index, 'options', newOptions)
                            }}
                            placeholder={`Option ${optIndex + 1}`}
                            required
                          />
                          <input
                            type="radio"
                            name={`correct-${index}`}
                            checked={question.correct_answer === optIndex}
                            onChange={() => updateQuestion(index, 'correct_answer', optIndex)}
                            className="rounded-full"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          <div className="flex justify-end space-x-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (assessment ? 'Update Assessment' : 'Create Assessment')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
