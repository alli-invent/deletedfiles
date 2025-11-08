import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { 
  Award,
  Download,
  Eye,
  Search,
  Filter,
  Calendar,
  BookOpen,
  Share2
} from 'lucide-react'

export default function Certificates() {
  const [certificates, setCertificates] = useState([])
  const [filteredCertificates, setFilteredCertificates] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCertificates()
  }, [])

  useEffect(() => {
    filterCertificates()
  }, [certificates, searchTerm])

  const loadCertificates = async () => {
    // Simulate API call
    setTimeout(() => {
      setCertificates([
        {
          id: 1,
          title: 'Mathematics 101',
          course_name: 'Mathematics 101',
          issued_date: '2024-01-15',
          certificate_id: 'MATH101-2024-001',
          grade: 85,
          instructor: 'Dr. Smith',
          download_url: '/certificates/math101.pdf',
          share_url: '/certificates/math101/share',
          status: 'issued'
        },
        {
          id: 2,
          title: 'Science Fundamentals',
          course_name: 'Science Fundamentals',
          issued_date: '2024-02-20',
          certificate_id: 'SCI101-2024-002',
          grade: 92,
          instructor: 'Prof. Johnson',
          download_url: '/certificates/science101.pdf',
          share_url: '/certificates/science101/share',
          status: 'issued'
        },
        {
          id: 3,
          title: 'Web Development Bootcamp',
          course_name: 'Web Development',
          issued_date: '2024-03-10',
          certificate_id: 'WEB101-2024-003',
          grade: 88,
          instructor: 'Ms. Davis',
          download_url: '/certificates/webdev.pdf',
          share_url: '/certificates/webdev/share',
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
        cert.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.certificate_id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredCertificates(filtered)
  }

  const handleDownload = (certificate) => {
    // Simulate download
    console.log('Downloading certificate:', certificate.certificate_id)
    // In a real app, this would trigger file download
  }

  const handleShare = (certificate) => {
    // Simulate share functionality
    if (navigator.share) {
      navigator.share({
        title: `My ${certificate.course_name} Certificate`,
        text: `I completed ${certificate.course_name} with a grade of ${certificate.grade}%!`,
        url: certificate.share_url,
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(certificate.share_url)
      alert('Certificate link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Certificates</h1>
          <p className="text-muted-foreground">Loading your certificates...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Certificates</h1>
        <p className="text-muted-foreground">
          View and manage your course completion certificates
        </p>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search certificates by course, instructor, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{certificates.length}</div>
              <div className="text-sm text-muted-foreground">Total Certificates</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Certificates Grid */}
      {filteredCertificates.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No certificates found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'Try adjusting your search criteria.' : 'Complete courses to earn certificates.'}
            </p>
            {!searchTerm && (
              <Button asChild>
                <a href="/courses">Browse Courses</a>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCertificates.map((certificate) => (
            <Card key={certificate.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="success" className="flex items-center space-x-1">
                    <Award className="h-3 w-3" />
                    <span>Completed</span>
                  </Badge>
                  <Badge variant="outline">{certificate.grade}%</Badge>
                </div>
                <CardTitle className="text-lg">{certificate.course_name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  Issued for successful completion of the course
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Certificate ID:</span>
                    <span className="font-mono text-xs">{certificate.certificate_id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Instructor:</span>
                    <span>{certificate.instructor}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Issued:</span>
                    <span>{new Date(certificate.issued_date).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    className="flex-1" 
                    onClick={() => handleDownload(certificate)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleShare(certificate)}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>Valid indefinitely</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="h-3 w-3" />
                    <span>Verified</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Certificate Verification */}
      <Card>
        <CardHeader>
          <CardTitle>Verify Certificate</CardTitle>
          <CardDescription>
            Enter a certificate ID to verify its authenticity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Input
              placeholder="Enter certificate ID (e.g., MATH101-2024-001)"
              className="flex-1"
            />
            <Button>
              <Eye className="h-4 w-4 mr-2" />
              Verify
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}