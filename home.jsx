import React from 'react';
import { Link } from 'react-router-dom';
import { useTenant } from '../../contexts/tenant-context';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import {
  BookOpen,
  Users,
  Award,
  Video,
  CheckCircle,
  ArrowRight,
  Star
} from 'lucide-react';

const Home = () => {
  const { currentTenant, getSubdomain } = useTenant();
  const subdomain = getSubdomain();

  const features = [
    {
      icon: BookOpen,
      title: 'Comprehensive Courses',
      description: 'Access a wide range of courses with structured learning paths and expert instruction.',
    },
    {
      icon: Users,
      title: 'Expert Instructors',
      description: 'Learn from industry professionals with real-world experience and teaching expertise.',
    },
    {
      icon: Award,
      title: 'Industry Certificates',
      description: 'Earn recognized certificates that boost your career and validate your skills.',
    },
    {
      icon: Video,
      title: 'Live & Recorded Classes',
      description: 'Flexible learning with both live interactive sessions and self-paced recorded content.',
    },
    {
      icon: CheckCircle,
      title: 'Hands-on Projects',
      description: 'Apply your knowledge with real-world projects and practical assignments.',
    },
    {
      icon: Star,
      title: 'Career Support',
      description: 'Get career guidance, interview preparation, and job placement assistance.',
    },
  ];

  const stats = [
    { number: '10,000+', label: 'Active Students' },
    { number: '500+', label: 'Expert Instructors' },
    { number: '200+', label: 'Courses Available' },
    { number: '95%', label: 'Completion Rate' },
  ];

  if (subdomain && currentTenant) {
    // Tenant-specific homepage
    return (
      <div className="bg-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to {currentTenant.name}
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Transform your learning journey with our comprehensive educational platform
            </p>
            <div className="space-x-4">
              <Link to="/courses">
                <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                  Browse Courses
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-primary-700">
                  Join Now
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Choose {currentTenant.name}?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                We provide the tools and support you need to succeed in your learning journey
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-primary-600" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Main site homepage
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Professional School Management
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Transform your educational institution with our comprehensive multi-tenant management platform
          </p>
          <div className="space-x-4">
            <Link to="/onboarding">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                Create Your Institution
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/courses">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-primary-700">
                Explore Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Run Your Institution
            </h2>
            <p className="text-xl text-gray-600">
              From student enrollment to certificate generation, we've got you covered
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Users className="w-12 h-12 text-primary-600 mb-4" />
                <CardTitle>Student Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Complete student lifecycle management from enrollment to graduation with progress tracking and performance analytics.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BookOpen className="w-12 h-12 text-primary-600 mb-4" />
                <CardTitle>Course Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Create and deliver engaging courses with multimedia content, assessments, and interactive learning tools.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Award className="w-12 h-12 text-primary-600 mb-4" />
                <CardTitle>Certification</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Generate professional certificates with verification and issue digital credentials to your students.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
