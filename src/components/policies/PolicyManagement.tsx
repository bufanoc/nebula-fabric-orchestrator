
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Clock, Users, Network } from "lucide-react";

export const PolicyManagement = () => {
  const policies = [
    {
      id: "policy-001",
      name: "DMZ Access Control",
      type: "Access Control",
      tenant: "Production",
      status: "active",
      appliedTo: 12,
      created: "2024-01-20",
      description: "Restricts access to DMZ network segments"
    },
    {
      id: "policy-002", 
      name: "QoS High Priority",
      type: "Quality of Service",
      tenant: "Production",
      status: "active",
      appliedTo: 8,
      created: "2024-01-25",
      description: "Ensures high priority traffic gets bandwidth preference"
    },
    {
      id: "policy-003",
      name: "Dev Environment Isolation",
      type: "Network Isolation",
      tenant: "Development",
      status: "active",
      appliedTo: 6,
      created: "2024-02-01",
      description: "Isolates development traffic from production networks"
    },
    {
      id: "policy-004",
      name: "Bandwidth Limiting",
      type: "Traffic Control",
      tenant: "Development",
      status: "inactive",
      appliedTo: 0,
      created: "2024-02-05",
      description: "Limits bandwidth usage for non-critical applications"
    }
  ];

  const policyTypes = [
    { type: "Access Control", count: 8, color: "bg-red-100 text-red-800" },
    { type: "Quality of Service", count: 5, color: "bg-blue-100 text-blue-800" },
    { type: "Network Isolation", count: 7, color: "bg-green-100 text-green-800" },
    { type: "Traffic Control", count: 4, color: "bg-yellow-100 text-yellow-800" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Policy Management</h1>
          <p className="text-gray-600 mt-1">Configure network policies and enforcement rules</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          Create Policy
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {policyTypes.map((type, index) => (
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
                  <Button variant="outline" size="sm" className="flex-1">
                    Edit Policy
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`flex-1 ${
                      policy.status === 'active' 
                        ? 'text-red-600 hover:text-red-700' 
                        : 'text-green-600 hover:text-green-700'
                    }`}
                  >
                    {policy.status === 'active' ? 'Disable' : 'Enable'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
