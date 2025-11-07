import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Loader2, Save, X } from 'lucide-react';

const courseSchema = z.object({
  title: z.string().min(1, 'Course title is required'),
  code: z.string().min(1, 'Course code is required'),
  short_description: z.string().optional(),
  duration_weeks: z.number().min(1, 'Duration must be at least 1 week'),
  price_decimal: z.number().min(0, 'Price cannot be negative'),
  delivery: z.enum(['online', 'offline', 'hybrid']),
});

const CourseForm = ({
  course = null,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: course || {
      title: '',
      code: '',
      short_description: '',
      duration_weeks: 12,
      price_decimal: 0,
      delivery: 'online',
    },
  });

  const delivery = watch('delivery');

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {course ? 'Edit Course' : 'Create New Course'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Course Title *
              </label>
              <Input
                id="title"
                {...register('title')}
                placeholder="e.g., Introduction to Web Development"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="code" className="text-sm font-medium">
                Course Code *
              </label>
              <Input
                id="code"
                {...register('code')}
                placeholder="e.g., WEB101"
                className={errors.code ? 'border-red-500' : ''}
              />
              {errors.code && (
                <p className="text-red-500 text-sm">{errors.code.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="short_description" className="text-sm font-medium">
              Short Description
            </label>
            <textarea
              id="short_description"
              {...register('short_description')}
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              placeholder="Brief description of the course..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label htmlFor="duration_weeks" className="text-sm font-medium">
                Duration (Weeks) *
              </label>
              <Input
                id="duration_weeks"
                type="number"
                {...register('duration_weeks', { valueAsNumber: true })}
                className={errors.duration_weeks ? 'border-red-500' : ''}
              />
              {errors.duration_weeks && (
                <p className="text-red-500 text-sm">{errors.duration_weeks.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="price_decimal" className="text-sm font-medium">
                Price ($) *
              </label>
              <Input
                id="price_decimal"
                type="number"
                step="0.01"
                {...register('price_decimal', { valueAsNumber: true })}
                className={errors.price_decimal ? 'border-red-500' : ''}
              />
              {errors.price_decimal && (
                <p className="text-red-500 text-sm">{errors.price_decimal.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="delivery" className="text-sm font-medium">
                Delivery Mode *
              </label>
              <select
                id="delivery"
                {...register('delivery')}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          {delivery !== 'online' && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> For {delivery} courses, you'll need to set up
                physical locations and schedules after creating the course.
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {course ? 'Update Course' : 'Create Course'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CourseForm;
