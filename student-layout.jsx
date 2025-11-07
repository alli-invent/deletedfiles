import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Header from './header';
import {
  BookOpen,
  Home,
  Calendar,
  Award,
  CreditCard,
  MessageSquare,
  Settings
} from 'lucide-react';
import { cn } from '../../../utils/helpers';

const StudentLayout = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/student', icon: Home },
    { name: 'My Courses', href: '/student/courses', icon: BookOpen },
    { name: 'Calendar', href: '/student/calendar', icon: Calendar },
    { name: 'Grades', href: '/student/grades', icon: Award },
    { name: 'Certificates', href: '/student/certificates', icon: Award },
    { name: 'Payments', href: '/student/payments', icon: CreditCard },
    { name: 'Messages', href: '/student/messages', icon: MessageSquare },
    { name: 'Settings', href: '/student/settings', icon: Settings },
  ];

  const isActive = (path) => {
    if (path === '/student' && location.pathname === '/student') return true;
    return location.pathname.startsWith(path) && path !== '/student';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:pt-16">
          <div className="flex flex-col flex-1 min-h-0 border-r border-gray-200 bg-white">
            <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
              <nav className="flex-1 px-2 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                        isActive(item.href)
                          ? 'bg-primary-100 text-primary-900 border-r-2 border-primary-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      )}
                    >
                      <Icon
                        className={cn(
                          'mr-3 flex-shrink-0 h-5 w-5',
                          isActive(item.href)
                            ? 'text-primary-600'
                            : 'text-gray-400 group-hover:text-gray-500'
                        )}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="md:pl-64 flex flex-col flex-1">
          <main className="flex-1">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default StudentLayout;
