import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { courseService } from '../../services/course-service'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { 
  Plus,
  Trash2,
  GripVertical,
  Video,
  FileText,
  Quiz,
  Save,
  Eye,
  Settings
} from 'lucide-react'

export default function CourseBuilder() {
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (id) {
      loadCourse()
    } else {
      setLoading(false)
    }
  }, [id])

  const loadCourse = async () => {
    try {
      const courseData = await courseService.getCourseById(id)
      setCourse(courseData)
      setModules(courseData.modules || [])
    } catch (error) {
      console.error('Error loading course:', error)
    } finally {
      setLoading(false)
    }
  }

  const addModule = () => {
    const newModule = {
      id: `module-${Date.now()}`,
      title: 'New Module',
      description: '',
      order: modules.length,
      lessons: []
    }
    setModules([...modules, newModule])
  }

  const updateModule = (moduleId, updates) => {
    setModules(modules.map(module =>
      module.id === moduleId ? { ...module, ...updates } : module
    ))
  }

  const deleteModule = (moduleId) => {
    setModules(modules.filter(module => module.id !== moduleId))
  }

  const addLesson = (moduleId) => {
    const newLesson = {
      id: `lesson-${Date.now()}`,
      title: 'New Lesson',
      type: 'video',
      content: '',
      duration: 0,
      order: modules.find(m => m.id === moduleId).lessons.length
    }
    setModules(modules.map(module =>
      module.id === moduleId
        ? { ...module, lessons: [...module.lessons, newLesson] }
        : module
    ))
  }

  const updateLesson = (moduleId, lessonId, updates) => {
    setModules(modules.map(module =>
      module.id === moduleId
        ? {
            ...module,
            lessons: module.lessons.map(lesson =>
              lesson.id === lessonId ? { ...lesson, ...updates } : lesson
            )
          }
        : module
    ))
  }

  const deleteLesson = (moduleId, lessonId) => {
    setModules(modules.map(module =>
      module.id === moduleId
        ? { ...module, lessons: module.lessons.filter(lesson => lesson.id !== lessonId) }
        : module
    ))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (id) {
        await courseService.updateCourse(id, { modules })
      } else {
        // Handle new course creation
        console.log('Creating new course with modules:', modules)
      }
      // Show success message
    } catch (error) {
      console.error('Error saving course:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Course Builder</h1>
          <p className="text-muted-foreground">Loading course...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Course Builder</h1>
          <p className="text-muted-foreground">
            {id ? `Editing: ${course?.title}` : 'Create a new course'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Course'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Course Structure */}
        <div className="lg:col-span-3 space-y-6">
          {modules.map((module, moduleIndex) => (
            <Card key={module.id} className="group">
              <CardHeader className="pb-3">
                <div className="flex items-start space-x-3">
                  <div className="flex items-center space-x-2 text-muted-foreground cursor-move">
                    <GripVertical className="h-4 w-4" />
                    <Badge variant="outline">Module {moduleIndex + 1}</Badge>
                  </div>
                  <div className="flex-1 space-y-2">
                    <Input
                      value={module.title}
                      onChange={(e) => updateModule(module.id, { title: e.target.value })}
                      placeholder="Module title"
                      className="text-lg font-semibold border-none p-0 focus-visible:ring-0"
                    />
                    <Textarea
                      value={module.description}
                      onChange={(e) => updateModule(module.id, { description: e.target.value })}
                      placeholder="Module description"
                      className="border-none p-0 focus-visible:ring-0 resize-none"
                      rows={2}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteModule(module.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {module.lessons.map((lesson, lessonIndex) => (
                  <div
                    key={lesson.id}
                    className="flex items-center space-x-3 p-3 border rounded-lg group/lesson"
                  >
                    <div className="flex items-center space-x-2 text-muted-foreground cursor-move">
                      <GripVertical className="h-4 w-4" />
                      {lesson.type === 'video' && <Video className="h-4 w-4" />}
                      {lesson.type === 'text' && <FileText className="h-4 w-4" />}
                      {lesson.type === 'quiz' && <Quiz className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <Input
                        value={lesson.title}
                        onChange={(e) => updateLesson(module.id, lesson.id, { title: e.target.value })}
                        placeholder="Lesson title"
                        className="border-none p-0 focus-visible:ring-0"
                      />
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <select
                          value={lesson.type}
                          onChange={(e) => updateLesson(module.id, lesson.id, { type: e.target.value })}
                          className="text-sm border-none p-0 bg-transparent"
                        >
                          <option value="video">Video</option>
                          <option value="text">Reading</option>
                          <option value="quiz">Quiz</option>
                        </select>
                        <Input
                          type="number"
                          value={lesson.duration}
                          onChange={(e) => updateLesson(module.id, lesson.id, { duration: parseInt(e.target.value) })}
                          placeholder="Duration (min)"
                          className="w-20 h-6 text-sm"
                        />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover/lesson:opacity-100"
                      onClick={() => deleteLesson(module.id, lesson.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addLesson(module.id)}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Lesson
                </Button>
              </CardContent>
            </Card>
          ))}

          <Button
            onClick={addModule}
            variant="outline"
            className="w-full h-20 border-dashed"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Module
          </Button>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Course Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Course Status</Label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Difficulty Level</Label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input placeholder="Course category" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Modules:</span>
                <span>{modules.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Lessons:</span>
                <span>{modules.reduce((acc, module) => acc + module.lessons.length, 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Duration:</span>
                <span>
                  {modules.reduce((acc, module) => 
                    acc + module.lessons.reduce((lessonAcc, lesson) => lessonAcc + lesson.duration, 0), 0
                  )} min
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}