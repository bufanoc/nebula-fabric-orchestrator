
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Clock, Network, Plus } from "lucide-react";
import { toast } from "sonner";

interface Policy {
  id: string;
  name: string;
  type: string;
  tenant: string;
  status: 'active' | 'inactive';
  appliedTo: number;
  created: string;
  description: string;
}

export const PolicyManagement = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [tenants, setTenants] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPolicy, setNewPolicy] = useState({
    name: "",
    type: "",
    tenant: "",
    description: ""
  });

  const policyTypes = [
    "Access Control",
    "Quality of Service", 
    "Network Isolation",
    "Traffic Control"
  ];

  useEffect(() => {
    // Load policies from localStorage
    const storedPolicies = JSON.parse(localStorage.getItem('dvsc_policies') || '[]');
    setPolicies(storedPolicies);

    // Load tenants for dropdown
    const storedTenants = JSON.parse(localStorage.getItem('dvsc_tenants') || '[]');
    setTenants(storedTenants.map((t: any) => t.name));
  }, []);

  const handleCreatePolicy = () => {
    if (!newPolicy.name.trim() || !newPolicy.type || !newPolicy.tenant || !newPolicy.description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const policy: Policy = {
      id: `policy-${Date.now()}`,
      name: newPolicy.name,
      type: newPolicy.type,
      tenant: newPolicy.tenant,
      status: 'active',
      appliedTo: 0,
      created: new Date().toISOString().split('T')[0],
      description: newPolicy.description
    };

    const updatedPolicies = [...policies, policy];
    setPolicies(updatedPolicies);
    localStorage.setItem('dvsc_policies', JSON.stringify(updatedPolicies));

    // Add event
    const events = JSON.parse(localStorage.getItem('dvsc_events') || '[]');
    events.unshift({
      type: 'success',
      message: `Policy "${policy.name}" created for tenant "${policy.tenant}"`,
      time: new Date().toLocaleString()
    });
    localStorage.setItem('dvsc_events', JSON.stringify(events.slice(0, 10)));

    setNewPolicy({ name: "", type: "", tenant: "", description: "" });
    setIsDialogOpen(false);
    toast.success(`Policy "${policy.name}" created successfully`);
  };

  const togglePolicyStatus = (policyId: string) => {
    const updatedPolicies = policies.map(policy => {
      if (policy.id === policyId) {
        const newStatus = policy.status === 'active' ? 'inactive' : 'active';
        
        // Add event
        const events = JSON.parse(localStorage.getItem('dvsc_events') || '[]');
        events.unshift({
          type: newStatus === 'active' ? 'success' : 'warning',
          message: `Policy "${policy.name}" ${newStatus === 'active' ? 'enabled' : 'disabled'}`,
          time: new Date().toLocaleString()
        });
        localStorage.setItem('dvsc_events', JSON.stringify(events.slice(0, 10)));

        return { ...policy, status: newStatus };
      }
      return policy;
    });

    setPolicies(updatedPolicies);
    localStorage.setItem('dvsc_policies', JSON.stringify(updatedPolicies));
  };

  const handleDeletePolicy = (policyId: string) => {
    const policyToDelete = policies.find(p => p.id === policyId);
    const updatedPolicies = policies.filter(p => p.id !== policyId);
    setPolicies(updatedPolicies);
    localStorage.setItem('dvsc_policies', JSON.stringify(updatedPolicies));

    if (policyToDelete) {
      const events = JSON.parse(localStorage.getItem('dvsc_events') || '[]');
      events.unshift({
        type: 'warning',
        message: `Policy "${policyToDelete.name}" deleted`,
        time: new Date().toLocaleString()
      });
      localStorage.setItem('dvsc_events', JSON.stringify(events.slice(0, 10)));
      toast.success(`Policy "${policyToDelete.name}" deleted`);
    }
  };

  const getTypeStats = () => {
    return policyTypes.map(type => ({
      type,
      count: policies.filter(p => p.type === type && p.status === 'active').length,
      color: type === 'Access Control' ? 'bg-red-100 text-red-800' :
             type === 'Quality of Service' ? 'bg-blue-100 text-blue-800' :
             type === 'Network Isolation' ? 'bg-green-100 text-green-800' :
             'bg-yellow-100 text-yellow-800'
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Policy Management</h1>
          <p className="text-gray-600 mt-1">Configure network policies and enforcement rules</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Create Policy
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Policy</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="policyName">Policy Name</Label>
                <Input
                  id="policyName"
                  value={newPolicy.name}
                  onChange={(e) => setNewPolicy({ ...newPolicy, name: e.target.value })}
                  placeholder="Enter policy name"
                />
              </div>
              <div>
                <Label htmlFor="policyType">Policy Type</Label>
                <Select value={newPolicy.type} onValueChange={(value) => setNewPolicy({ ...newPolicy, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select policy type" />
                  </SelectTrigger>
                  <SelectContent>
                    {policyTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="policyTenant">Tenant</Label>
                <Select value={newPolicy.tenant} onValueChange={(value) => setNewPolicy({ ...newPolicy, tenant: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tenant" />
                  </SelectTrigger>
                  <SelectContent>
                    {tenants.map((tenant) => (
                      <SelectItem key={tenant} value={tenant}>{tenant}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="policyDescription">Description</Label>
                <Textarea
                  id="policyDescription"
                  value={newPolicy.description}
                  onChange={(e) => setNewPolicy({ ...newPolicy, description: e.target.value })}
                  placeholder="Enter policy description"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreatePolicy}>
                  Create Policy
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {getTypeStats().map((type, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{type.type}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{type.count}</p>
                </div>
                <Badge className={type.color}>Active</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {policies.length === 0 ? (
        <Card className="h-96">
          <CardContent className="h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <Shield className="h-16 w-16 text-gray-300 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">No Policies</h3>
                <p className="text-gray-500 mt-2">Create your first policy to get started</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {policies.map((policy) => (
            <Card key={policy.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-5 w-5 text-blue-600" />
                    {policy.name}
                  </CardTitle>
                  <Badge 
                    variant={policy.status === 'active' ? 'default' : 'secondary'}
                    className={policy.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                  >
                    {policy.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">{policy.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Type</p>
                      <p className="font-medium">{policy.type}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Tenant</p>
                      <p className="font-medium">{policy.tenant}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Network className="mr-2 h-4 w-4 text-gray-500" />
                        <span className="text-sm">Applied To</span>
                      </div>
                      <span className="text-sm font-medium">{policy.appliedTo} ports</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-gray-500" />
                        <span className="text-sm">Created</span>
                      </div>
                      <span className="text-sm font-medium">{policy.created}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={`flex-1 ${
                        policy.status === 'active' 
                          ? 'text-red-600 hover:text-red-700' 
                          : 'text-green-600 hover:text-green-700'
                      }`}
                      onClick={() => togglePolicyStatus(policy.id)}
                    >
                      {policy.status === 'active' ? 'Disable' : 'Enable'}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-red-600 hover:text-red-700"
                      onClick={() => handleDeletePolicy(policy.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
