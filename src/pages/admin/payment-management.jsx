import React, { useState, useEffect } from 'react'
import { paymentService } from '../../services/payment-service'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import {
  Search,
  Filter,
  Download,
  CreditCard,
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'

export default function PaymentManagement() {
  const [payments, setPayments] = useState([])
  const [filteredPayments, setFilteredPayments] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [revenueStats, setRevenueStats] = useState({})

  useEffect(() => {
    loadPayments()
    loadRevenueStats()
  }, [])

  useEffect(() => {
    filterPayments()
  }, [payments, searchTerm, statusFilter, dateFilter])

  const loadPayments = async () => {
    try {
      const paymentsData = await paymentService.getPayments()
      setPayments(paymentsData)
    } catch (error) {
      console.error('Error loading payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadRevenueStats = async () => {
    try {
      const stats = await paymentService.getRevenueStats()
      setRevenueStats(stats)
    } catch (error) {
      console.error('Error loading revenue stats:', error)
    }
  }

  const filterPayments = () => {
    let filtered = payments

    if (searchTerm) {
      filtered = filtered.filter(payment =>
        payment.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.payment_id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.status === statusFilter)
    }

    if (dateFilter !== 'all') {
      const now = new Date()
      const filterDate = new Date()

      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0)
          filtered = filtered.filter(payment => new Date(payment.paid_date) >= filterDate)
          break
        case 'week':
          filterDate.setDate(now.getDate() - 7)
          filtered = filtered.filter(payment => new Date(payment.paid_date) >= filterDate)
          break
        case 'month':
          filterDate.setMonth(now.getMonth() - 1)
          filtered = filtered.filter(payment => new Date(payment.paid_date) >= filterDate)
          break
      }
    }

    setFilteredPayments(filtered)
  }

  const processRefund = async (paymentId) => {
    if (window.confirm('Are you sure you want to process a refund for this payment?')) {
      try {
        // Simulate refund processing
        console.log('Processing refund for payment:', paymentId)
        await new Promise(resolve => setTimeout(resolve, 1000))
        // In real app, call paymentService.processRefund(paymentId)
      } catch (error) {
        console.error('Error processing refund:', error)
      }
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      completed: 'success',
      pending: 'warning',
      failed: 'destructive',
      refunded: 'secondary'
    }
    const icons = {
      completed: CheckCircle,
      pending: Clock,
      failed: XCircle,
      refunded: CreditCard
    }
    const IconComponent = icons[status]
    return (
      <Badge variant={variants[status]} className="flex items-center space-x-1">
        <IconComponent className="h-3 w-3" />
        <span>{status}</span>
      </Badge>
    )
  }

  const getPaymentMethodBadge = (method) => {
    return <Badge variant="outline">{method.replace('_', ' ')}</Badge>
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Payment Management</h1>
          <p className="text-muted-foreground">Loading payments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payment Management</h1>
          <p className="text-muted-foreground">
            Manage payments, subscriptions, and revenue
          </p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${revenueStats.total_revenue?.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              All time revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${revenueStats.monthly_revenue?.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              +18% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {revenueStats.active_subscriptions || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Recurring revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {revenueStats.success_rate || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Payment success rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Payments</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
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
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Quick Stats</label>
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-muted-foreground">Total:</span>
                <span className="font-semibold">{payments.length}</span>
                <span className="text-muted-foreground">Completed:</span>
                <span className="font-semibold text-green-600">
                  {payments.filter(p => p.status === 'completed').length}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Records</CardTitle>
          <CardDescription>
            {filteredPayments.length} payments found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 font-medium">Payment ID</th>
                  <th className="text-left py-3 font-medium">Student</th>
                  <th className="text-left py-3 font-medium">Course</th>
                  <th className="text-left py-3 font-medium">Amount</th>
                  <th className="text-left py-3 font-medium">Method</th>
                  <th className="text-left py-3 font-medium">Date</th>
                  <th className="text-left py-3 font-medium">Status</th>
                  <th className="text-right py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 font-mono text-xs">
                      {payment.payment_id}
                    </td>
                    <td className="py-3">
                      <div>
                        <div className="font-medium">{payment.student_name}</div>
                        <div className="text-xs text-muted-foreground">{payment.student_email}</div>
                      </div>
                    </td>
                    <td className="py-3">
                      {payment.course_name}
                    </td>
                    <td className="py-3">
                      <div className="font-semibold">${payment.amount}</div>
                    </td>
                    <td className="py-3">
                      {getPaymentMethodBadge(payment.payment_method)}
                    </td>
                    <td className="py-3">
                      {new Date(payment.paid_date || payment.created_date).toLocaleDateString()}
                    </td>
                    <td className="py-3">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        {payment.status === 'completed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => processRefund(payment.id)}
                          >
                            Refund
                          </Button>
                        )}
                        {payment.status === 'pending' && (
                          <Button
                            variant="outline"
                            size="sm"
                          >
                            Retry
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          Details
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPayments.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No payments found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              Latest payment activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payments.slice(0, 5).map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      payment.status === 'completed' ? 'bg-green-100 text-green-600' :
                      payment.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      <CreditCard className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{payment.student_name}</div>
                      <div className="text-xs text-muted-foreground">{payment.course_name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${payment.amount}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(payment.paid_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>
              Distribution of payment methods
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(
                payments.reduce((acc, payment) => {
                  acc[payment.payment_method] = (acc[payment.payment_method] || 0) + 1
                  return acc
                }, {})
              ).map(([method, count]) => (
                <div key={method} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{method.replace('_', ' ')}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${(count / payments.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8 text-right">
                      {Math.round((count / payments.length) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
