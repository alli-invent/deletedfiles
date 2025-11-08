import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { useToast } from '../../hooks/use-toast'

export default function PaymentForm({ payment, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    student_id: '',
    course_id: '',
    amount: 0,
    payment_method: 'credit_card',
    status: 'pending',
    due_date: '',
    paid_date: ''
  })
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()

  useEffect(() => {
    if (payment) {
      setFormData({
        student_id: payment.student_id || '',
        course_id: payment.course_id || '',
        amount: payment.amount || 0,
        payment_method: payment.payment_method || 'credit_card',
        status: payment.status || 'pending',
        due_date: payment.due_date || '',
        paid_date: payment.paid_date || ''
      })
    }
  }, [payment])

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await onSubmit(formData)
      addToast({
        title: 'Success',
        description: payment ? 'Payment updated successfully' : 'Payment created successfully',
        variant: 'default'
      })
    } catch (error) {
      addToast({
        title: 'Error',
        description: error.response?.data?.message || 'Something went wrong',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{payment ? 'Edit Payment' : 'Create New Payment'}</CardTitle>
        <CardDescription>
          {payment ? 'Update payment information' : 'Record a new payment'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="student_id">Student ID</Label>
              <Input
                id="student_id"
                value={formData.student_id}
                onChange={(e) => handleChange('student_id', e.target.value)}
                placeholder="Enter student ID"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="course_id">Course ID</Label>
              <Input
                id="course_id"
                value={formData.course_id}
                onChange={(e) => handleChange('course_id', e.target.value)}
                placeholder="Enter course ID"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleChange('amount', parseFloat(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_method">Payment Method</Label>
              <Select value={formData.payment_method} onValueChange={(value) => handleChange('payment_method', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="debit_card">Debit Card</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Payment Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="due_date">Due Date</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => handleChange('due_date', e.target.value)}
                required
              />
            </div>

            {formData.status === 'completed' && (
              <div className="space-y-2">
                <Label htmlFor="paid_date">Paid Date</Label>
                <Input
                  id="paid_date"
                  type="date"
                  value={formData.paid_date}
                  onChange={(e) => handleChange('paid_date', e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (payment ? 'Update Payment' : 'Create Payment')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
