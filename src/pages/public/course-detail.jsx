import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { courseService } from '../../services/course-service'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import {
  BookOpen,
  Clock,
  Users,
  Star,
  ChevronRight,
  PlayCircle,
  FileText,
  CheckCircle,
  User
} from 'lucide-react'

export default function CourseDetail() {
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enrolled, setEnrolled] = useState(false)

  useEffect(() => {
    loadCourse()
  }, [id])

  const loadCourse = async () => {
    try {
      const courseData = await courseService.getCourseById(id)
      setCourse(courseData)
      // Check if user is enrolled (this would come from user context in a real app)
      setEnrolled(false) // Mock data
    } catch (error) {
      console.error('Error loading course:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async () => {
    try {
      await courseService.enrollInCourse(id)
      setEnrolled(true)
    } catch (error) {
      console.error('Error enrolling in course:', error)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Loading course...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Course not found</h2>
          <Link to="/courses">
            <Button>Back to Catalog</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link to="/courses" className="hover:text-primary">Courses</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{course.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-center space-x-4 mb-4">
              <Badge variant="secondary">{course.category}</Badge>
              <Badge variant={
                course.level === 'beginner' ? 'success' :
                course.level === 'intermediate' ? 'warning' : 'destructive'
              }>
                {course.level}
              </Badge>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">{course.title}</h1>
            <p className="text-xl text-muted-foreground mb-6">{course.description}</p>

            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{course.duration} hours</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{course.enrollment_count || 0} students</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{course.rating || '4.5'} rating</span>
              </div>
            </div>
          </div>

          {/* Course Image */}
          <div className="aspect-video bg-muted rounded-lg overflow-hidden">
            {course.thumbnail ? (
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BookOpen className="h-16 w-16 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Course Content */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="instructor">Instructor</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div dangerouslySetInnerHTML={{ __html: course.long_description }} />
            </TabsContent>

            <TabsContent value="curriculum">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Course Content</h3>
                <div className="space-y-2">
                  {course.modules?.map((module, index) => (
                    <Card key={module.id}>
                      <CardHeader className="py-3">
                        <CardTitle className="text-base flex items-center justify-between">
                          <span>Module {index + 1}: {module.title}</span>
                          <span className="text-sm text-muted-foreground">
                            {module.lessons?.length || 0} lessons
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="py-0 pb-3">
                        <div className="space-y-2">
                          {module.lessons?.map((lesson, lessonIndex) => (
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between p-2 rounded hover:bg-muted"
                            >
                              <div className="flex items-center space-x-3">
                                <PlayCircle className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                  {lessonIndex + 1}. {lesson.title}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  {lesson.duration}m
                                </span>
                                {enrolled && (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="instructor">
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{course.instructor?.name || 'Expert Instructor'}</CardTitle>
                      <CardDescription>
                        {course.instructor?.bio || 'Experienced professional in this field'}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {course.instructor?.full_bio || 'This instructor has extensive experience and is dedicated to helping students succeed.'}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                ${course.price === 0 ? 'Free' : course.price}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {enrolled ? (
                <div className="space-y-3">
                  <Button className="w-full" asChild>
                    <Link to={`/course/${course.id}`}>
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Continue Learning
                    </Link>
                  </Button>
                  <p className="text-sm text-center text-muted-foreground">
                    You are enrolled in this course
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <Button className="w-full" onClick={handleEnroll}>
                    Enroll Now
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    {course.price === 0
                      ? 'Free forever access'
                      : '30-day money-back guarantee'
                    }
                  </p>
                </div>
              )}

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span>{course.duration} hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Level</span>
                  <span className="capitalize">{course.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span>{new Date(course.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What You'll Learn</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Comprehensive understanding of the subject</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Practical skills and applications</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Certificate of completion</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
