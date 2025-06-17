
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Network, Cpu, HardDrive, Wifi, Plus } from "lucide-react";
import { toast } from "sonner";

interface VirtualSwitch {
  id: string;
  name: string;
  tenant: string;
  hypervisor: string;
  ports: number;
  activePorts: number;
  status: 'active' | 'warning' | 'inactive';
  uptime: string;
  throughput: string;
  created: string;
}

export const SwitchManagement = () => {
  const [switches, setSwitches] = useState<VirtualSwitch[]>([]);
  const [tenants, setTenants] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSwitch, setNewSwitch] = useState({
    name: "",
    tenant: "",
    hypervisor: "",
    ports: 24
  });

  useEffect(() => {
    // Load switches from localStorage
    const storedSwitches = JSON.parse(localStorage.getItem('dvsc_switches') || '[]');
    setSwitches(storedSwitches);

    // Load tenants for dropdown
    const storedTenants = JSON.parse(localStorage.getItem('dvsc_tenants') || '[]');
    setTenants(storedTenants.map((t: any) => t.name));
  }, []);

  const handleCreateSwitch = () => {
    if (!newSwitch.name.trim() || !newSwitch.tenant || !newSwitch.hypervisor) {
      toast.error("Please fill in all required fields");
      return;
    }

    const virtualSwitch: VirtualSwitch = {
      id: `vswitch-${Date.now()}`,
      name: newSwitch.name,
      tenant: newSwitch.tenant,
      hypervisor: newSwitch.hypervisor,
      ports: newSwitch.ports,
      activePorts: Math.floor(Math.random() * newSwitch.ports),
      status: 'active',
      uptime: '0 days',
      throughput: '0 Gbps',
      created: new Date().toISOString()
    };

    const updatedSwitches = [...switches, virtualSwitch];
    setSwitches(updatedSwitches);
    localStorage.setItem('dvsc_switches', JSON.stringify(updatedSwitches));

    // Add event
    const events = JSON.parse(localStorage.getItem('dvsc_events') || '[]');
    events.unshift({
      type: 'success',
      message: `Virtual switch "${virtualSwitch.name}" created in tenant "${virtualSwitch.tenant}"`,
      time: new Date().toLocaleString()
    });
    localStorage.setItem('dvsc_events', JSON.stringify(events.slice(0, 10)));

    setNewSwitch({ name: "", tenant: "", hypervisor: "", ports: 24 });
    setIsDialogOpen(false);
    toast.success(`Virtual switch "${virtualSwitch.name}" created successfully`);
  };

  const handleDeleteSwitch = (switchId: string) => {
    const switchToDelete = switches.find(s => s.id === switchId);
    const updatedSwitches = switches.filter(s => s.id !== switchId);
    setSwitches(updatedSwitches);
    localStorage.setItem('dvsc_switches', JSON.stringify(updatedSwitches));

    if (switchToDelete) {
      const events = JSON.parse(localStorage.getItem('dvsc_events') || '[]');
      events.unshift({
        type: 'warning',
        message: `Virtual switch "${switchToDelete.name}" deleted`,
        time: new Date().toLocaleString()
      });
      localStorage.setItem('dvsc_events', JSON.stringify(events.slice(0, 10)));
      toast.success(`Virtual switch "${switchToDelete.name}" deleted`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Virtual Switch Management</h1>
          <p className="text-gray-600 mt-1">Configure and monitor distributed virtual switches</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Create Virtual Switch
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Virtual Switch</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="switchName">Switch Name</Label>
                <Input
                  id="switchName"
                  value={newSwitch.name}
                  onChange={(e) => setNewSwitch({ ...newSwitch, name: e.target.value })}
                  placeholder="Enter switch name"
                />
              </div>
              <div>
                <Label htmlFor="tenant">Tenant</Label>
                <Select value={newSwitch.tenant} onValueChange={(value) => setNewSwitch({ ...newSwitch, tenant: value })}>
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
                <Label htmlFor="hypervisor">Hypervisor</Label>
                <Select value={newSwitch.hypervisor} onValueChange={(value) => setNewSwitch({ ...newSwitch, hypervisor: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select hypervisor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="XenServer-01">XenServer-01</SelectItem>
                    <SelectItem value="XenServer-02">XenServer-02</SelectItem>
                    <SelectItem value="XenServer-03">XenServer-03</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="ports">Number of Ports</Label>
                <Select value={newSwitch.ports.toString()} onValueChange={(value) => setNewSwitch({ ...newSwitch, ports: parseInt(value) })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="16">16 ports</SelectItem>
                    <SelectItem value="24">24 ports</SelectItem>
                    <SelectItem value="32">32 ports</SelectItem>
                    <SelectItem value="48">48 ports</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateSwitch}>
                  Create Switch
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {switches.length === 0 ? (
        <Card className="h-96">
          <CardContent className="h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <Network className="h-16 w-16 text-gray-300 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">No Virtual Switches</h3>
                <p className="text-gray-500 mt-2">Create your first virtual switch to get started</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {switches.map((vswitch) => (
            <Card key={vswitch.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Network className="mr-2 h-5 w-5 text-blue-600" />
                    {vswitch.name}
                  </CardTitle>
                  <Badge 
                    variant={vswitch.status === 'active' ? 'default' : 'secondary'}
                    className={
                      vswitch.status === 'active' ? 'bg-green-100 text-green-800' :
                      vswitch.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }
                  >
                    {vswitch.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Tenant</p>
                      <p className="font-medium">{vswitch.tenant}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Hypervisor</p>
                      <p className="font-medium">{vswitch.hypervisor}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Cpu className="mr-2 h-4 w-4 text-gray-500" />
                        <span className="text-sm">Ports</span>
                      </div>
                      <span className="text-sm font-medium">
                        {vswitch.activePorts}/{vswitch.ports}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Wifi className="mr-2 h-4 w-4 text-gray-500" />
                        <span className="text-sm">Throughput</span>
                      </div>
                      <span className="text-sm font-medium">{vswitch.throughput}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <HardDrive className="mr-2 h-4 w-4 text-gray-500" />
                        <span className="text-sm">Uptime</span>
                      </div>
                      <span className="text-sm font-medium">{vswitch.uptime}</span>
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(vswitch.activePorts / vswitch.ports) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    Port Utilization: {Math.round((vswitch.activePorts / vswitch.ports) * 100)}%
                  </p>

                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Configure
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteSwitch(vswitch.id)}
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
