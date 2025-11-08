import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import {
  Users,
  Award,
  Globe,
  BookOpen,
  Target,
  Heart
} from 'lucide-react'

export default function About() {
  const stats = [
    { value: '10,000+', label: 'Active Students' },
    { value: '500+', label: 'Courses' },
    { value: '200+', label: 'Expert Instructors' },
    { value: '50+', label: 'Countries' }
  ]

  const values = [
    {
      icon: Target,
      title: 'Excellence',
      description: 'We strive for excellence in education and continuously improve our platform.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building a supportive learning community where students can grow together.'
    },
    {
      icon: Globe,
      title: 'Accessibility',
      description: 'Making quality education accessible to everyone, everywhere.'
    },
    {
      icon: Heart,
      title: 'Passion',
      description: 'Driven by our passion for education and student success.'
    }
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl lg:text-5xl font-bold mb-6">About EduPortal</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          We are revolutionizing education through technology, making quality learning
          accessible to students and institutions worldwide.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {stats.map((stat, index) => (
          <Card key={index} className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-primary" />
              <span>Our Mission</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              To democratize education by providing a platform where anyone can learn,
              teach, and share knowledge. We believe that education should be accessible,
              affordable, and effective for everyone, regardless of their background or location.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-primary" />
              <span>Our Vision</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              To create a world where quality education is available to every individual,
              empowering them to achieve their full potential and contribute positively
              to their communities and the global society.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Values */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Values</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            These core values guide everything we do and shape our platform's development.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-lg">{value.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{value.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Story */}
      <Card className="mb-16">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Our Story</CardTitle>
        </CardHeader>
        <CardContent className="max-w-4xl mx-auto">
          <div className="prose prose-lg mx-auto">
            <p>
              EduPortal was founded in 2020 by a team of educators and technologists
              who recognized the growing need for flexible, accessible learning solutions.
              What started as a small project to help local institutions has grown into
              a comprehensive platform serving thousands of students worldwide.
            </p>
            <p>
              Today, we partner with educational institutions, corporations, and individual
              instructors to deliver high-quality courses across various disciplines. Our
              platform continues to evolve, incorporating the latest technologies to enhance
              the learning experience.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Whether you're a student looking to learn, an instructor wanting to teach,
          or an institution seeking to expand your reach, we have a place for you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg">Get Started</Button>
          <Button variant="outline" size="lg">Contact Us</Button>
        </div>
      </div>
    </div>
  )
}
