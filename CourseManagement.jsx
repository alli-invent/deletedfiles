import React, { useState, useEffect } from 'react';
import { courseService } from '../../services/api';
import CourseForm from '../../components/CourseForm';
import DataTable from '../../components/DataTable';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await courseService.getAllCourses();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleCreateCourse = async (courseData) => {
    await courseService.createCourse(courseData);
    setShowForm(false);
    fetchCourses();
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setShowForm(true);
  };

  const columns = [
    {
      key: 'code',
      header: 'Course Code'
    },
    {
      key: 'title',
      header: 'Title'
    },
    {
      key: 'delivery',
      header: 'Delivery'
    },
    {
      key: 'price_decimal',
      header: 'Price',
      render: (value) => `$${value}`
    },
    {
      key: 'is_published',
      header: 'Status',
      render: (value) => (
        <span className={`status ${value ? 'published' : 'draft'}`}>
          {value ? 'Published' : 'Draft'}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, course) => (
        <div className="action-buttons">
          <button
            onClick={() => handleEditCourse(course)}
            className="btn btn-sm btn-outline"
          >
            Edit
          </button>
          <button
            onClick={() => handleTogglePublish(course.id, !course.is_published)}
            className="btn btn-sm btn-outline"
          >
            {course.is_published ? 'Unpublish' : 'Publish'}
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="course-management">
      <div className="page-header">
        <h1>Course Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary"
        >
          Create New Course
        </button>
      </div>

      {showForm && (
        <CourseForm
          course={editingCourse}
          onSubmit={handleCreateCourse}
          onCancel={() => {
            setShowForm(false);
            setEditingCourse(null);
          }}
        />
      )}

      <DataTable
        data={courses}
        columns={columns}
        searchable={true}
        searchFields={['code', 'title']}
      />
    </div>
  );
};

export default CourseManagement;
