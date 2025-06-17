
import { useState, useEffect } from "react";
import { Policy } from "@/types/policy";
import { toast } from "sonner";

export const usePolicyManagement = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [tenants, setTenants] = useState<string[]>([]);

  useEffect(() => {
    // Load policies from localStorage with proper type casting
    const storedPolicies = JSON.parse(localStorage.getItem('dvsc_policies') || '[]');
    const typedPolicies: Policy[] = storedPolicies.map((policy: any) => ({
      ...policy,
      status: (policy.status === 'active' || policy.status === 'inactive') ? policy.status : 'active'
    }));
    setPolicies(typedPolicies);

    // Load tenants for dropdown
    const storedTenants = JSON.parse(localStorage.getItem('dvsc_tenants') || '[]');
    setTenants(storedTenants.map((t: any) => t.name));
  }, []);

  const createPolicy = (policyData: Omit<Policy, 'id' | 'status' | 'appliedTo' | 'created'>) => {
    const policy: Policy = {
      id: `policy-${Date.now()}`,
      name: policyData.name,
      type: policyData.type,
      tenant: policyData.tenant,
      status: 'active',
      appliedTo: 0,
      created: new Date().toISOString().split('T')[0],
      description: policyData.description
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

    toast.success(`Policy "${policy.name}" created successfully`);
    return policy;
  };

  const togglePolicyStatus = (policyId: string) => {
    const updatedPolicies = policies.map(policy => {
      if (policy.id === policyId) {
        const newStatus: 'active' | 'inactive' = policy.status === 'active' ? 'inactive' : 'active';
        
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

  const deletePolicy = (policyId: string) => {
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

  return {
    policies,
    tenants,
    createPolicy,
    togglePolicyStatus,
    deletePolicy
  };
};
