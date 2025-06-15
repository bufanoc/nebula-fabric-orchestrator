
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Users, Network, Shield, Eye, Settings, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Tenant {
  id: string;
  name: string;
  description: string;
  switches: number;
  policies: number;
  status: 'active' | 'inactive';
  created: string;
}

export const TenantManagement = () => {
  const [tenants, setTenants] = useState<Tenant[]>([
    {
      id: "1",
      name: "Production",
      description: "Production environment tenant",
      switches: 4,
      policies: 12,
      status: "active",
      created: "2024-01-15"
    },
    {
      id: "2",
      name: "Development",
      description: "Development and testing environment",
      switches: 2,
      policies: 6,
      status: "active",
      created: "2024-02-01"
    },
    {
      id: "3",
      name: "Staging",
      description: "Pre-production staging environment",
      switches: 3,
      policies: 8,
      status: "active",
      created: "2024-02-10"
    }
  ]);

  const [newTenant, setNewTenant] = useState({
    name: "",
    description: ""
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  const handleCreateTenant = () => {
    if (!newTenant.name.trim()) {
      toast.error("Tenant name is required");
      return;
    }

    const tenant: Tenant = {
      id: Date.now().toString(),
      name: newTenant.name,
      description: newTenant.description,
      switches: 0,
      policies: 0,
      status: "active",
      created: new Date().toISOString().split('T')[0]
    };

    setTenants([...tenants, tenant]);
    setNewTenant({ name: "", description: "" });
    setIsDialogOpen(false);
    toast.success(`Tenant "${tenant.name}" created successfully`);
  };

  const viewDetails = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setDetailsDialogOpen(true);
  };

  const configureTenant = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setConfigDialogOpen(true);
  };

  const deleteTenant = (tenantId: string) => {
    const tenant = tenants.find(t => t.id === tenantId);
    if (tenant) {
      setTenants(prev => prev.filter(t => t.id !== tenantId));
      toast.success(`Tenant "${tenant.name}" deleted successfully`);
    }
  };

  const toggleTenantStatus = (tenantId: string) => {
    setTenants(prev => prev.map(tenant => 
      tenant.id === tenantId 
        ? { ...tenant, status: tenant.status === 'active' ? 'inactive' : 'active' }
        : tenant
    ));
    
    const tenant = tenants.find(t => t.id === tenantId);
    toast.success(`Tenant "${tenant?.name}" ${tenant?.status === 'active' ? 'deactivated' : 'activated'}`);
  };

  const updateTenantConfig = () => {
    if (selectedTenant) {
      toast.success(`Configuration updated for ${selectedTenant.name}`);
      setConfigDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tenant Management</h1>
          <p className="text-gray-600 mt-1">Manage multi-tenant network isolation and policies</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Create Tenant
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Tenant</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="name">Tenant Name</Label>
                <Input
                  id="name"
                  value={newTenant.name}
                  onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
                  placeholder="Enter tenant name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newTenant.description}
                  onChange={(e) => setNewTenant({ ...newTenant, description: e.target.value })}
                  placeholder="Enter tenant description"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTenant}>
                  Create Tenant
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tenants.map((tenant) => (
          <Card key={tenant.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-blue-600" />
                  {tenant.name}
                </CardTitle>
                <Badge 
                  variant={tenant.status === 'active' ? 'default' : 'secondary'}
                  className={tenant.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                >
                  {tenant.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4">{tenant.description}</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Network className="mr-2 h-4 w-4 text-gray-500" />
                    <span className="text-sm">Virtual Switches</span>
                  </div>
                  <Badge variant="outline">{tenant.switches}</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Shield className="mr-2 h-4 w-4 text-gray-500" />
                    <span className="text-sm">Active Policies</span>
                  </div>
                  <Badge variant="outline">{tenant.policies}</Badge>
                </div>
                
                <div className="pt-3 border-t">
                  <p className="text-xs text-gray-500">Created: {tenant.created}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => viewDetails(tenant)}
                  >
                    <Eye className="mr-1 h-4 w-4" />
                    Details
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => configureTenant(tenant)}
                  >
                    <Settings className="mr-1 h-4 w-4" />
                    Configure
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => toggleTenantStatus(tenant.id)}
                    className={tenant.status === 'active' ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'}
                  >
                    {tenant.status === 'active' ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => deleteTenant(tenant.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="mr-1 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tenant Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Tenant Details</DialogTitle>
          </DialogHeader>
          {selectedTenant && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Tenant Name</Label>
                  <p className="text-sm text-gray-600">{selectedTenant.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <p className="text-sm text-gray-600 capitalize">{selectedTenant.status}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Virtual Switches</Label>
                  <p className="text-sm text-gray-600">{selectedTenant.switches}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Active Policies</Label>
                  <p className="text-sm text-gray-600">{selectedTenant.policies}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Created Date</Label>
                  <p className="text-sm text-gray-600">{selectedTenant.created}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm text-gray-600">{selectedTenant.description}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded">
                <p className="text-sm text-blue-800">
                  <strong>Network Isolation:</strong> This tenant has dedicated virtual switches and 
                  isolated network policies ensuring secure multi-tenancy.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Tenant Configuration Dialog */}
      <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Configure Tenant - {selectedTenant?.name}</DialogTitle>
          </DialogHeader>
          {selectedTenant && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="tenantName">Tenant Name</Label>
                <Input
                  id="tenantName"
                  defaultValue={selectedTenant.name}
                  placeholder="Tenant name"
                />
              </div>
              <div>
                <Label htmlFor="tenantDesc">Description</Label>
                <Input
                  id="tenantDesc"
                  defaultValue={selectedTenant.description}
                  placeholder="Tenant description"
                />
              </div>
              <div>
                <Label htmlFor="maxSwitches">Maximum Virtual Switches</Label>
                <Input
                  id="maxSwitches"
                  type="number"
                  defaultValue="10"
                  placeholder="Maximum switches allowed"
                />
              </div>
              <div>
                <Label htmlFor="maxPolicies">Maximum Policies</Label>
                <Input
                  id="maxPolicies"
                  type="number"
                  defaultValue="50"
                  placeholder="Maximum policies allowed"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setConfigDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={updateTenantConfig}>
                  Save Configuration
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
