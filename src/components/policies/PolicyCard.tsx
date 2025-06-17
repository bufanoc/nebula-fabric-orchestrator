
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Clock, Network } from "lucide-react";
import { Policy } from "@/types/policy";

interface PolicyCardProps {
  policy: Policy;
  onToggleStatus: (policyId: string) => void;
  onDelete: (policyId: string) => void;
}

export const PolicyCard = ({ policy, onToggleStatus, onDelete }: PolicyCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
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
              onClick={() => onToggleStatus(policy.id)}
            >
              {policy.status === 'active' ? 'Disable' : 'Enable'}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 text-red-600 hover:text-red-700"
              onClick={() => onDelete(policy.id)}
            >
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
