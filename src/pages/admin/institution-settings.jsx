import React, { useState, useEffect } from 'react'
import { useTenant } from '../../hooks/use-tenant'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import {
  Save,
  Upload,
  Building,
  Mail,
  Phone,
  MapPin,
  Globe,
  Users,
  CreditCard,
  Shield,
  Palette
} from 'lucide-react'

export default function InstitutionSettings() {
  const { currentTenant, updateTenant } = useTenant()
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (currentTenant) {
      setSettings({
        // Basic Information
        name: currentTenant.name || '',
        subdomain: currentTenant.subdomain || '',
        contact_email: currentTenant.contact_email || '',
        phone: currentTenant.phone || '',
        address: currentTenant.address || '',
        city: currentTenant.city || '',
        country: currentTenant.country || '',
        tagline: currentTenant.tagline || '',
        description: currentTenant.description || '',

        // Branding
        logo_url: currentTenant.logo_url || '',
        primary_color: currentTenant.primary_color || '#3b82f6',
        secondary_color: currentTenant.secondary_color || '#1e40af',

        // Features
        features: {
          certificates: currentTenant.features?.certificates || true,
          assessments: currentTenant.features?.assessments || true,
          payments: currentTenant.features?.payments || true,
          analytics: currentTenant.features?.analytics || true
        },

        // Billing
        billing_email: currentTenant.billing_email || '',
        plan: currentTenant.plan || 'pro',
        subscription_status: currentTenant.subscription_status || 'active'
      })
      setLoading(false)
    }
  }, [currentTenant])

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateTenant(currentTenant.id, settings)
      // Show success message
    } catch (error) {
      console.error('Error updating settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (section, field, value) => {
    if (section) {
      setSettings(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }))
    } else {
      setSettings(prev => ({ ...prev, [field]: value }))
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Institution Settings</h1>
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Institution Settings</h1>
          <p className="text-muted-foreground">
            Configure your institution's profile and preferences
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Your institution's public profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    <Building className="h-4 w-4 inline mr-2" />
                    Institution Name
                  </Label>
                  <Input
                    id="name"
                    value={settings.name}
                    onChange={(e) => handleChange(null, 'name', e.target.value)}
                    placeholder="Enter institution name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subdomain">
                    <Globe className="h-4 w-4 inline mr-2" />
                    Subdomain
                  </Label>
                  <Input
                    id="subdomain"
                    value={settings.subdomain}
                    onChange={(e) => handleChange(null, 'subdomain', e.target.value)}
                    placeholder="your-institution"
                  />
                  <p className="text-sm text-muted-foreground">
                    {settings.subdomain}.eduportal.com
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_email">
                    <Mail className="h-4 w-4 inline mr-2" />
                    Contact Email
                  </Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={settings.contact_email}
                    onChange={(e) => handleChange(null, 'contact_email', e.target.value)}
                    placeholder="contact@institution.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    <Phone className="h-4 w-4 inline mr-2" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    value={settings.phone}
                    onChange={(e) => handleChange(null, 'phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">
                    <MapPin className="h-4 w-4 inline mr-2" />
                    Address
                  </Label>
                  <Input
                    id="address"
                    value={settings.address}
                    onChange={(e) => handleChange(null, 'address', e.target.value)}
                    placeholder="Street address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={settings.city}
                    onChange={(e) => handleChange(null, 'city', e.target.value)}
                    placeholder="City"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={settings.country}
                    onChange={(e) => handleChange(null, 'country', e.target.value)}
                    placeholder="Country"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={settings.tagline}
                    onChange={(e) => handleChange(null, 'tagline', e.target.value)}
                    placeholder="Brief description of your institution"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Institution Description</Label>
                <Textarea
                  id="description"
                  value={settings.description}
                  onChange={(e) => handleChange(null, 'description', e.target.value)}
                  placeholder="Describe your institution, its mission, and values..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Branding & Appearance</CardTitle>
              <CardDescription>
                Customize your institution's look and feel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                    {settings.logo_url ? (
                      <img
                        src={settings.logo_url}
                        alt="Logo"
                        className="w-16 h-16 object-contain"
                      />
                    ) : (
                      <Building className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Institution Logo</Label>
                    <div className="flex space-x-2">
                      <Input
                        value={settings.logo_url}
                        onChange={(e) => handleChange(null, 'logo_url', e.target.value)}
                        placeholder="https://example.com/logo.png"
                        className="flex-1"
                      />
                      <Button variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Recommended: 200x200px PNG or JPG
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="primary_color">
                      <Palette className="h-4 w-4 inline mr-2" />
                      Primary Color
                    </Label>
                    <div className="flex space-x-2">
                      <Input
                        id="primary_color"
                        type="color"
                        value={settings.primary_color}
                        onChange={(e) => handleChange(null, 'primary_color', e.target.value)}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={settings.primary_color}
                        onChange={(e) => handleChange(null, 'primary_color', e.target.value)}
                        className="flex-1 font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondary_color">
                      <Palette className="h-4 w-4 inline mr-2" />
                      Secondary Color
                    </Label>
                    <div className="flex space-x-2">
                      <Input
                        id="secondary_color"
                        type="color"
                        value={settings.secondary_color}
                        onChange={(e) => handleChange(null, 'secondary_color', e.target.value)}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={settings.secondary_color}
                        onChange={(e) => handleChange(null, 'secondary_color', e.target.value)}
                        className="flex-1 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="border rounded-lg p-6">
                <h4 className="font-semibold mb-4">Preview</h4>
                <div className="space-y-3">
                  <div
                    className="h-3 rounded-full"
                    style={{ backgroundColor: settings.primary_color }}
                  />
                  <div
                    className="h-2 rounded-full"
                    style={{ backgroundColor: settings.secondary_color }}
                  />
                  <div className="flex space-x-2">
                    <Button style={{ backgroundColor: settings.primary_color }}>
                      Primary Button
                    </Button>
                    <Button variant="outline">Secondary Button</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Feature Settings</CardTitle>
              <CardDescription>
                Enable or disable platform features for your institution
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-semibold">Certificates</div>
                      <div className="text-sm text-muted-foreground">
                        Issue course completion certificates
                      </div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.features?.certificates}
                      onChange={(e) => handleChange('features', 'certificates', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-semibold">Assessments</div>
                      <div className="text-sm text-muted-foreground">
                        Create quizzes and exams
                      </div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.features?.assessments}
                      onChange={(e) => handleChange('features', 'assessments', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="font-semibold">Payments</div>
                      <div className="text-sm text-muted-foreground">
                        Accept payments for courses
                      </div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.features?.payments}
                      onChange={(e) => handleChange('features', 'payments', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-orange-600" />
                    <div>
                      <div className="font-semibold">Analytics</div>
                      <div className="text-sm text-muted-foreground">
                        Access detailed analytics
                      </div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.features?.analytics}
                      onChange={(e) => handleChange('features', 'analytics', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing & Subscription</CardTitle>
              <CardDescription>
                Manage your subscription and billing information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="billing_email">Billing Email</Label>
                  <Input
                    id="billing_email"
                    type="email"
                    value={settings.billing_email}
                    onChange={(e) => handleChange(null, 'billing_email', e.target.value)}
                    placeholder="billing@institution.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Current Plan</Label>
                  <div className="flex items-center space-x-2">
                    <Badge variant={
                      settings.plan === 'enterprise' ? 'destructive' :
                      settings.plan === 'pro' ? 'default' : 'secondary'
                    }>
                      {settings.plan?.toUpperCase()}
                    </Badge>
                    <Badge variant={
                      settings.subscription_status === 'active' ? 'success' : 'destructive'
                    }>
                      {settings.subscription_status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-6">
                <h4 className="font-semibold mb-4">Plan Features</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="font-semibold mb-2">Basic</div>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>✓ Up to 100 students</li>
                      <li>✓ 5 courses</li>
                      <li>✓ Basic analytics</li>
                      <li>✗ Certificates</li>
                      <li>✗ Advanced features</li>
                    </ul>
                  </div>
                  <div>
                    <div className="font-semibold mb-2">Pro</div>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>✓ Up to 1000 students</li>
                      <li>✓ Unlimited courses</li>
                      <li>✓ Advanced analytics</li>
                      <li>✓ Certificates</li>
                      <li>✓ All features</li>
                    </ul>
                  </div>
                  <div>
                    <div className="font-semibold mb-2">Enterprise</div>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>✓ Unlimited students</li>
                      <li>✓ Unlimited courses</li>
                      <li>✓ Custom analytics</li>
                      <li>✓ White-labeling</li>
                      <li>✓ Priority support</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button variant="outline">
                  Upgrade Plan
                </Button>
                <Button variant="outline">
                  View Invoices
                </Button>
                <Button variant="outline">
                  Update Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
