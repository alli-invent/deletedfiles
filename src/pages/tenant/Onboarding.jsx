import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Building, Users, BookOpen, CreditCard } from 'lucide-react'

export default function TenantOnboarding() {
  const features = [
    {
      icon: Building,
      title: 'Create Your Institution',
      description: 'Set up your educational institution with custom branding and settings'
    },
    {
      icon: Users,
      title: 'Manage Users',
      description: 'Add students, instructors, and administrators to your platform'
    },
    {
      icon: BookOpen,
      title: 'Create Courses',
      description: 'Build and publish courses with rich content and assessments'
    },
    {
      icon: CreditCard,
      title: 'Payment Setup',
      description: 'Configure payment methods and pricing for your courses'
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Welcome to EduPortal
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Let's get your educational institution set up on our platform.
            Follow these simple steps to start managing your courses and students.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Ready to Get Started?</CardTitle>
            <CardDescription>
              Set up your institution in just a few minutes. You can always customize settings later.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <Link to="/tenant/setup">
                <Button size="lg" className="w-full">
                  Begin Setup
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground">
                Already have an institution?{' '}
                <Link to="/login" className="text-primary hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
