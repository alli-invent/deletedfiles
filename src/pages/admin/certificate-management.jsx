import React, { useState, useEffect } from 'react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import {
  Search,
  Filter,
  Download,
  Eye,
  Award,
  User,
  BookOpen,
  Calendar,
  CheckCircle,
  FileText
} from 'lucide-react'

export default function CertificateManagement() {
  const [certificates, setCertificates] = useState([])
  const [filteredCertificates, setFilteredCertificates] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [courseFilter, setCourseFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCertificates()
  }, [])

  useEffect(() => {
    filterCertificates()
  }, [certificates, searchTerm, courseFilter, dateFilter])

  const loadCertificates = async () => {
    // Simulate API call
    setTimeout(() => {
      setCertificates([
        {
          id: 1,
          certificate_id: 'CERT-2024-001',
          student_name: 'John Doe',
          student_email: 'john.doe@student.edu',
          course_name: 'Mathematics 101',
          instructor: 'Dr. Smith',
          institution: 'Tech University',
          issued_date: '2024-01-15',
          grade: 85,
          download_url: '/certificates/math101.pdf',
          status: 'issued'
        },
        {
          id: 2,
          certificate_id: 'CERT-2024-002',
          student_name: 'Sarah Wilson',
          student_email: 'sarah.wilson@student.edu',
          course_name: 'Science Fundamentals',
          instructor: 'Prof. Johnson',
          institution: 'Science College',
          issued_date: '2024-02-20',
          grade: 92,
          download_url: '/certificates/science101.pdf',
          status: 'issued'
        },
        {
          id: 3,
          certificate_id: 'CERT-2024-003',
          student_name: 'Mike Johnson',
          student_email: 'mike.johnson@student.edu',
          course_name: 'Web Development',
          instructor: 'Ms. Davis',
          institution: 'Tech University',
          issued_date: '2024-03-10',
          grade: 88,
          download_url: '/certificates/webdev.pdf',
          status: 'issued'
        },
        {
          id: 4,
          certificate_id: 'CERT-2024-004',
          student_name: 'Emily Chen',
          student_email: 'emily.chen@student.edu',
          course_name: 'Mathematics 101',
          instructor: 'Dr. Smith',
          institution: 'Tech University',
          issued_date: '2024-03-12',
          grade: 78,
          download_url: '/certificates/math101-2.pdf',
          status: 'issued'
        }
      ])
      setLoading(false)
    }, 1000)
  }

  const filterCertificates = () => {
    let filtered = certificates

    if (searchTerm) {
      filtered = filtered.filter(cert =>
        cert.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.certificate_id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (courseFilter !== 'all') {
      filtered = filtered.filter(cert => cert.course_name === courseFilter)
    }

    if (dateFilter !== 'all') {
      const now = new Date()
      const filterDate = new Date()

      switch (dateFilter) {
        case 'week':
          filterDate.setDate(now.getDate() - 7)
          filtered = filtered.filter(cert => new Date(cert.issued_date) >= filterDate)
          break
        case 'month':
          filterDate.setMonth(now.getMonth() - 1)
          filtered = filtered.filter(cert => new Date(cert.issued_date) >= filterDate)
          break
        case 'quarter':
          filterDate.setMonth(now.getMonth() - 3)
          filtered = filtered.filter(cert => new Date(cert.issued_date) >= filterDate)
          break
      }
    }

    setFilteredCertificates(filtered)
  }

  const generateCertificate = () => {
    // Simulate certificate generation
    console.log('Generating new certificate...')
  }

  const revokeCertificate = (certificateId) => {
    if (window.confirm('Are you sure you want to revoke this certificate?')) {
      // Simulate certificate revocation
      console.log('Revoking certificate:', certificateId)
    }
  }

  const courses = [...new Set(certificates.map(cert => cert.course_name))]

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Certificate Management</h1>
          <p className="text-muted-foreground">Loading certificates...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Certificate Management</h1>
          <p className="text-muted-foreground">
            Generate and manage course completion certificates
          </p>
        </div>
        <Button onClick={generateCertificate}>
          <Award className="h-4 w-4 mr-2" />
          Generate Certificate
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Certificates</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{certificates.length}</div>
            <p className="text-xs text-muted-foreground">
              All time issued
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {certificates.filter(cert => {
                const certDate = new Date(cert.issued_date)
                const now = new Date()
                return certDate.getMonth() === now.getMonth() && certDate.getFullYear() === now.getFullYear()
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Issued this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Grade</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(certificates.reduce((acc, cert) => acc + cert.grade, 0) / certificates.length)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Average completion grade
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Institutions</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(certificates.map(cert => cert.institution)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              Participating institutions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Certificates</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search certificates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Course</label>
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="all">All Courses</option>
                {courses.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="all">All Time</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="quarter">Last 90 Days</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Quick Actions</label>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Bulk Issue
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Certificates Table */}
      <Card>
        <CardHeader>
          <CardTitle>Certificate Records</CardTitle>
          <CardDescription>
            {filteredCertificates.length} certificates found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 font-medium">Certificate ID</th>
                  <th className="text-left py-3 font-medium">Student</th>
                  <th className="text-left py-3 font-medium">Course</th>
                  <th className="text-left py-3 font-medium">Institution</th>
                  <th className="text-left py-3 font-medium">Grade</th>
                  <th className="text-left py-3 font-medium">Issued Date</th>
                  <th className="text-left py-3 font-medium">Status</th>
                  <th className="text-right py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCertificates.map((certificate) => (
                  <tr key={certificate.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 font-mono text-xs">
                      {certificate.certificate_id}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{certificate.student_name}</div>
                          <div className="text-xs text-muted-foreground">{certificate.student_email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span>{certificate.course_name}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      {certificate.institution}
                    </td>
                    <td className="py-3">
                      <Badge variant={
                        certificate.grade >= 90 ? 'success' :
                        certificate.grade >= 80 ? 'default' :
                        certificate.grade >= 70 ? 'warning' : 'destructive'
                      }>
                        {certificate.grade}%
                      </Badge>
                    </td>
                    <td className="py-3">
                      {new Date(certificate.issued_date).toLocaleDateString()}
                    </td>
                    <td className="py-3">
                      <Badge variant="success" className="flex items-center space-x-1">
                        <CheckCircle className="h-3 w-3" />
                        <span>Verified</span>
                      </Badge>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => revokeCertificate(certificate.id)}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCertificates.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No certificates found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Certificate Verification */}
      <Card>
        <CardHeader>
          <CardTitle>Certificate Verification</CardTitle>
          <CardDescription>
            Verify the authenticity of a certificate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Input
              placeholder="Enter certificate ID (e.g., CERT-2024-001)"
              className="flex-1"
            />
            <Button>
              <CheckCircle className="h-4 w-4 mr-2" />
              Verify Certificate
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
