import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { courseService } from '../../services/course-service'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { 
  PlayCircle,
  CheckCircle,
  FileText,
  Download,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock
} from 'lucide-react'

export default function CoursePlayer() {
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [currentModule, setCurrentModule] = useState(0)
  const [currentLesson, setCurrentLesson] = useState(0)
  const [progress, setProgress] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCourse()
  }, [id])

  const loadCourse = async () => {
    try {
      const courseData = await courseService.getCourseById(id)
      setCourse(courseData)
      // Load progress
      const progressData = await courseService.getCourseProgress(id)
      setProgress(progressData)
    } catch (error) {
      console.error('Error loading course:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsCompleted = async () => {
    try {
      const module = course.modules[currentModule]
      const lesson = module.lessons[currentLesson]
      await courseService.updateProgress(id, module.id, {
        lesson_id: lesson.id,
        completed: true,
        time_spent: lesson.duration
      })
      
      // Update local progress
      setProgress(prev => ({
        ...prev,
        [module.id]: {
          ...prev[module.id],
          [lesson.id]: { completed: true }
        }
      }))

      // Move to next lesson if available
      if (currentLesson < module.lessons.length - 1) {
        setCurrentLesson(currentLesson + 1)
      } else if (currentModule < course.modules.length - 1) {
        setCurrentModule(currentModule + 1)
        setCurrentLesson(0)
      }
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }

  const navigateToLesson = (moduleIndex, lessonIndex) => {
    setCurrentModule(moduleIndex)
    setCurrentLesson(lessonIndex)
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Loading course...</p>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Course not found</h2>
          <Link to="/my-courses">
            <Button>Back to My Courses</Button>
          </Link>
        </div>
      </div>
    )
  }

  const module = course.modules[currentModule]
  const lesson = module?.lessons[currentLesson]

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <Link to="/my-courses">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Courses
              </Button>
            </Link>
            <div>
              <h1 className="font-semibold">{course.title}</h1>
              <p className="text-sm text-muted-foreground">
                Module {currentModule + 1} of {course.modules.length}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary">{course.level}</Badge>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-80 border-r bg-muted/10 overflow-y-auto">
          <div className="p-4">
            <h2 className="font-semibold mb-4">Course Content</h2>
            <div className="space-y-2">
              {course.modules.map((module, moduleIndex) => (
                <div key={module.id} className="space-y-1">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-background">
                    <span className="font-medium text-sm">
                      {moduleIndex + 1}. {module.title}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {module.lessons.length} lessons
                    </Badge>
                  </div>
                  <div className="space-y-1 ml-4">
                    {module.lessons.map((lesson, lessonIndex) => {
                      const isCompleted = progress[module.id]?.[lesson.id]?.completed
                      const isCurrent = moduleIndex === currentModule && lessonIndex === currentLesson
                      
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => navigateToLesson(moduleIndex, lessonIndex)}
                          className={`w-full text-left p-2 rounded-lg text-sm flex items-center space-x-2 transition-colors ${
                            isCurrent 
                              ? 'bg-primary text-primary-foreground' 
                              : isCompleted
                                ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                : 'hover:bg-muted'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <PlayCircle className="h-4 w-4" />
                          )}
                          <span className="flex-1">{lesson.title}</span>
                          <Clock className="h-3 w-3" />
                          <span className="text-xs">{lesson.duration}m</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {lesson ? (
            <>
              {/* Lesson Header */}
              <div className="border-b p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">{lesson.title}</h2>
                    <p className="text-muted-foreground">
                      Module {currentModule + 1}: {module.title}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Materials
                    </Button>
                    <Button onClick={markAsCompleted} size="sm">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Complete
                    </Button>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{lesson.duration} minutes</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FileText className="h-4 w-4" />
                    <span>{lesson.type}</span>
                  </div>
                </div>
              </div>

              {/* Lesson Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                  {lesson.video_url ? (
                    <div className="aspect-video bg-black rounded-lg mb-6">
                      <video
                        controls
                        className="w-full h-full rounded-lg"
                        src={lesson.video_url}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ) : (
                    <Card className="mb-6">
                      <CardContent className="p-12 text-center">
                        <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Reading Material</h3>
                        <p className="text-muted-foreground mb-4">
                          This lesson contains reading materials and resources.
                        </p>
                        <Button>
                          <Download className="h-4 w-4 mr-2" />
                          Download Materials
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  <Card>
                    <CardHeader>
                      <CardTitle>Lesson Content</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div 
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: lesson.content }}
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Navigation */}
              <div className="border-t p-4">
                <div className="flex justify-between max-w-4xl mx-auto">
                  <Button
                    variant="outline"
                    disabled={currentModule === 0 && currentLesson === 0}
                    onClick={() => {
                      if (currentLesson > 0) {
                        setCurrentLesson(currentLesson - 1)
                      } else if (currentModule > 0) {
                        setCurrentModule(currentModule - 1)
                        setCurrentLesson(course.modules[currentModule - 1].lessons.length - 1)
                      }
                    }}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>

                  <Button
                    onClick={() => {
                      if (currentLesson < module.lessons.length - 1) {
                        setCurrentLesson(currentLesson + 1)
                      } else if (currentModule < course.modules.length - 1) {
                        setCurrentModule(currentModule + 1)
                        setCurrentLesson(0)
                      }
                    }}
                    disabled={
                      currentModule === course.modules.length - 1 &&
                      currentLesson === module.lessons.length - 1
                    }
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No lesson selected</h3>
                <p className="text-muted-foreground">
                  Select a lesson from the sidebar to begin learning.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}