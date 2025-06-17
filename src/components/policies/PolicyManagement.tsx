
import { Card, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { PolicyForm } from "./PolicyForm";
import { PolicyStats } from "./PolicyStats";
import { PolicyCard } from "./PolicyCard";
import { usePolicyManagement } from "@/hooks/usePolicyManagement";

export const PolicyManagement = () => {
  const {
    policies,
    tenants,
    createPolicy,
    togglePolicyStatus,
    deletePolicy
  } = usePolicyManagement();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Policy Management</h1>
          <p className="text-gray-600 mt-1">Configure network policies and enforcement rules</p>
        </div>
        
        <PolicyForm tenants={tenants} onCreatePolicy={createPolicy} />
      </div>

      <PolicyStats policies={policies} />

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
            <PolicyCard
              key={policy.id}
              policy={policy}
              onToggleStatus={togglePolicyStatus}
              onDelete={deletePolicy}
            />
          ))}
        </div>
      )}
    </div>
  );
};
