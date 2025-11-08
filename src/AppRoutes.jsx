import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/use-auth'
import { useTenant } from './hooks/use-tenant'

// Layouts
import PublicLayout from './components/layout/public-layout'
import TenantLayout from './components/layout/tenant-layout'
import StudentLayout from './components/layout/student-layout'
import InstructorLayout from './components/layout/instructor-layout'
import AdminLayout from './components/layout/admin-layout'

// Public Pages
import Home from './pages/public/home'
import CourseCatalog from './pages/public/course-catalog'
import CourseDetail from './pages/public/course-detail'
import About from './pages/public/about'
import Contact from './pages/public/contact'

// Auth Pages
import Login from './pages/auth/login'
import Register from './pages/auth/register'
import ForgotPassword from './pages/auth/forgot-password'

// Tenant Pages
import TenantOnboarding from './pages/tenant/onboarding'
import TenantSetup from './pages/tenant/setup'

// Student Pages
import StudentDashboard from './pages/student/dashboard'
import MyCourses from './pages/student/my-courses'
import CoursePlayer from './pages/student/course-player'
import Assignments from './pages/student/assignments'
import Grades from './pages/student/grades'
import Certificates from './pages/student/certificates'
import StudentProfile from './pages/student/profile'

// Instructor Pages
import InstructorDashboard from './pages/instructor/dashboard'
import CourseManagement from './pages/instructor/course-management'
import CourseBuilder from './pages/instructor/course-builder'
import AssessmentBuilder from './pages/instructor/assessment-builder'
import Gradebook from './pages/instructor/gradebook'
import Attendance from './pages/instructor/attendance'
import Analytics from './pages/instructor/analytics'

// Admin Pages
import AdminDashboard from './pages/admin/dashboard'
import UserManagement from './pages/admin/user-management'
import AdminCourseManagement from './pages/admin/course-management'
import EnrollmentManagement from './pages/admin/enrollment-management'
import PaymentManagement from './pages/admin/payment-management'
import CertificateManagement from './pages/admin/certificate-management'
import InstitutionSettings from './pages/admin/institution-settings'
import Reports from './pages/admin/reports'

// Shared Pages
import NotFound from './pages/shared/not-found'
import Unauthorized from './pages/shared/unauthorized'
import Loading from './pages/shared/loading'

export default function AppRoutes() {
  const { user, loading } = useAuth()
  const { currentTenant } = useTenant()

  if (loading) {
    return <Loading />
  }

  // Public routes
  if (!user) {
    return (
      <PublicLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<CourseCatalog />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/tenant/onboarding" element={<TenantOnboarding />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </PublicLayout>
    )
  }

  // Tenant setup routes
  if (user.role === 'tenant_admin' && !currentTenant?.is_setup) {
    return (
      <TenantLayout>
        <Routes>
          <Route path="/tenant/setup" element={<TenantSetup />} />
          <Route path="*" element={<Navigate to="/tenant/setup" />} />
        </Routes>
      </TenantLayout>
    )
  }

  // Role-based routes
  return (
    <Routes>
      {/* Student Routes */}
      {user.role === 'student' && (
        <Route path="/*" element={<StudentLayout />}>
          <Route index element={<StudentDashboard />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="course/:id" element={<CoursePlayer />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="grades" element={<Grades />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>
      )}

      {/* Instructor Routes */}
      {user.role === 'instructor' && (
        <Route path="/*" element={<InstructorLayout />}>
          <Route index element={<InstructorDashboard />} />
          <Route path="dashboard" element={<InstructorDashboard />} />
          <Route path="courses" element={<CourseManagement />} />
          <Route path="course-builder" element={<CourseBuilder />} />
          <Route path="course-builder/:id" element={<CourseBuilder />} />
          <Route path="assessment-builder" element={<AssessmentBuilder />} />
          <Route path="gradebook" element={<Gradebook />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      )}

      {/* Admin Routes */}
      {user.role === 'admin' && (
        <Route path="/*" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="courses" element={<AdminCourseManagement />} />
          <Route path="enrollments" element={<EnrollmentManagement />} />
          <Route path="payments" element={<PaymentManagement />} />
          <Route path="certificates" element={<CertificateManagement />} />
          <Route path="settings" element={<InstitutionSettings />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      )}

      {/* Tenant Admin Routes */}
      {user.role === 'tenant_admin' && (
        <Route path="/*" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="courses" element={<AdminCourseManagement />} />
          <Route path="enrollments" element={<EnrollmentManagement />} />
          <Route path="payments" element={<PaymentManagement />} />
          <Route path="certificates" element={<CertificateManagement />} />
          <Route path="settings" element={<InstitutionSettings />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      )}

      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
