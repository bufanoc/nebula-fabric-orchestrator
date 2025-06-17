
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { POLICY_TYPES } from "@/types/policy";
import { toast } from "sonner";

interface PolicyFormProps {
  tenants: string[];
  onCreatePolicy: (policyData: {
    name: string;
    type: string;
    tenant: string;
    description: string;
  }) => void;
}

export const PolicyForm = ({ tenants, onCreatePolicy }: PolicyFormProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPolicy, setNewPolicy] = useState({
    name: "",
    type: "",
    tenant: "",
    description: ""
  });

  const handleCreatePolicy = () => {
    if (!newPolicy.name.trim() || !newPolicy.type || !newPolicy.tenant || !newPolicy.description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    onCreatePolicy(newPolicy);
    setNewPolicy({ name: "", type: "", tenant: "", description: "" });
    setIsDialogOpen(false);
  };

  return (
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
                {POLICY_TYPES.map((type) => (
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
  );
};
