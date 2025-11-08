import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTenant } from '../../hooks/use-tenant'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { useToast } from '../../hooks/use-toast'
import { Building, MapPin, Phone, Globe } from 'lucide-react'

export default function TenantSetup() {
  const [formData, setFormData] = useState({
    name: '',
    subdomain: '',
    contact_email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    tagline: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)
  const { createTenant } = useTenant()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await createTenant(formData)
      addToast({
        title: 'Success',
        description: 'Institution setup completed successfully!',
        variant: 'default'
      })
      navigate('/dashboard')
    } catch (error) {
      addToast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to setup institution',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Set Up Your Institution
          </h1>
          <p className="text-muted-foreground">
            Configure your educational institution's profile and settings
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Institution Information</CardTitle>
            <CardDescription>
              Enter your institution's details. You can update this information later in the settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    <Building className="h-4 w-4 inline mr-2" />
                    Institution Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Enter institution name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subdomain">
                    <Globe className="h-4 w-4 inline mr-2" />
                    Subdomain
                  </Label>
                  <Input
                    id="subdomain"
                    value={formData.subdomain}
                    onChange={(e) => handleChange('subdomain', e.target.value)}
                    placeholder="your-institution"
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    This will be used for your custom URL: {formData.subdomain || 'your-institution'}.eduportal.com
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => handleChange('contact_email', e.target.value)}
                    placeholder="contact@institution.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    <Phone className="h-4 w-4 inline mr-2" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
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
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="Street address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    placeholder="City"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleChange('country', e.target.value)}
                    placeholder="Country"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={formData.tagline}
                    onChange={(e) => handleChange('tagline', e.target.value)}
                    placeholder="Brief description of your institution"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Institution Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Describe your institution, its mission, and values..."
                  rows={4}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" size="lg" disabled={loading}>
                  {loading ? 'Setting Up...' : 'Complete Setup'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
