import React from 'react'
import { Link } from 'react-router-dom'
import { School } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <School className="h-6 w-6" />
              <span className="font-bold text-xl">EduPortal</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Empowering education through technology. Join thousands of students and educators in our learning community.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Platform</h4>
            <div className="space-y-2 text-sm">
              <Link to="/courses" className="block text-muted-foreground hover:text-primary">
                Course Catalog
              </Link>
              <Link to="/about" className="block text-muted-foreground hover:text-primary">
                About Us
              </Link>
              <Link to="/contact" className="block text-muted-foreground hover:text-primary">
                Contact
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Support</h4>
            <div className="space-y-2 text-sm">
              <Link to="/help" className="block text-muted-foreground hover:text-primary">
                Help Center
              </Link>
              <Link to="/faq" className="block text-muted-foreground hover:text-primary">
                FAQ
              </Link>
              <Link to="/privacy" className="block text-muted-foreground hover:text-primary">
                Privacy Policy
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Connect</h4>
            <div className="space-y-2 text-sm">
              <a href="#" className="block text-muted-foreground hover:text-primary">
                Twitter
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary">
                LinkedIn
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary">
                GitHub
              </a>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} EduPortal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
