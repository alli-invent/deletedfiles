import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTenant } from '../../contexts/tenant-context';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Input } from '../ui/input';
import { Building2, Search, Plus, LogOut } from 'lucide-react';

const TenantSwitcher = () => {
  const { currentTenant, getSubdomain } = useTenant();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - in real app, this would come from API
  const userTenants = [
    { id: '1', name: 'Banba Academy', slug: 'banba', role: 'admin' },
    { id: '2', name: 'Zanza University', slug: 'zanza', role: 'instructor' },
  ];

  const filteredTenants = userTenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const switchTenant = (tenantSlug) => {
    window.location.href = `https://${tenantSlug}.xyz.com`;
  };

  const handleCreateNew = () => {
    navigate('/onboarding');
  };

  const handleMainSite = () => {
    window.location.href = 'https://xyz.com';
  };

  if (!currentTenant) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2">
          <Building2 className="w-4 h-4" />
          <span className="max-w-[120px] truncate">{currentTenant.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <div className="p-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search institutions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <div className="max-h-60 overflow-y-auto">
          {filteredTenants.map((tenant) => (
            <DropdownMenuItem
              key={tenant.id}
              onClick={() => switchTenant(tenant.slug)}
              className="flex items-center justify-between p-3 cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">{tenant.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{tenant.role}</p>
                </div>
              </div>
              {tenant.slug === getSubdomain() && (
                <div className="w-2 h-2 rounded-full bg-green-500" />
              )}
            </DropdownMenuItem>
          ))}
        </div>

        <div className="p-2 border-t">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleCreateNew}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Institution
          </Button>
        </div>

        <div className="p-2 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-600"
            onClick={handleMainSite}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Back to Main Site
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TenantSwitcher;
