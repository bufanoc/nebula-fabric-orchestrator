
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Monitor, Network, Wifi, Play, Square, Pause, Trash2, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VirtualNIC {
  id: string;
  name: string;
  macAddress: string;
  networkId: string;
  networkName: string;
  ipAddress?: string;
  status: 'connected' | 'disconnected';
}

interface VirtualMachine {
  id: string;
  name: string;
  hostId: string;
  hostName: string;
  status: 'running' | 'stopped' | 'paused';
  nics: VirtualNIC[];
}

interface VirtualNetwork {
  id: string;
  name: string;
  subnet: string;
  vxlanId: number;
}

interface Props {
  networks: VirtualNetwork[];
  hosts: Array<{ id: string; name: string; status: string }>;
}

export const VMManagement = ({ networks, hosts }: Props) => {
  const [vms, setVMs] = useState<VirtualMachine[]>([]);
  const [isCreateVMOpen, setIsCreateVMOpen] = useState(false);
  const [isAddNICOpen, setIsAddNICOpen] = useState(false);
  const [selectedVM, setSelectedVM] = useState<string>('');
  const [newVM, setNewVM] = useState({
    name: '',
    hostId: ''
  });
  const [newNIC, setNewNIC] = useState({
    name: '',
    networkId: '',
    ipAddress: ''
  });
  const { toast } = useToast();

  const generateMACAddress = () => {
    const hexChars = '0123456789ABCDEF';
    let mac = '52:54:00'; // KVM/QEMU prefix
    for (let i = 0; i < 3; i++) {
      mac += ':';
      for (let j = 0; j < 2; j++) {
        mac += hexChars[Math.floor(Math.random() * 16)];
      }
    }
    return mac;
  };

  const createVM = () => {
    if (!newVM.name || !newVM.hostId) {
      toast({
        title: "Missing Information",
        description: "Please provide VM name and select a host.",
        variant: "destructive"
      });
      return;
    }

    const host = hosts.find(h => h.id === newVM.hostId);
    const vm: VirtualMachine = {
      id: `vm-${Date.now()}`,
      name: newVM.name,
      hostId: newVM.hostId,
      hostName: host?.name || 'Unknown',
      status: 'stopped',
      nics: []
    };

    setVMs(prev => [...prev, vm]);
    setNewVM({ name: '', hostId: '' });
    setIsCreateVMOpen(false);
    
    toast({
      title: "VM Created",
      description: `Virtual machine ${vm.name} created on ${vm.hostName}`
    });
  };

  const addNICToVM = () => {
    if (!selectedVM || !newNIC.networkId || !newNIC.name) {
      toast({
        title: "Missing Information",
        description: "Please select VM, network, and provide NIC name.",
        variant: "destructive"
      });
      return;
    }

    const network = networks.find(n => n.id === newNIC.networkId);
    if (!network) return;

    const nic: VirtualNIC = {
      id: `nic-${Date.now()}`,
      name: newNIC.name,
      macAddress: generateMACAddress(),
      networkId: newNIC.networkId,
      networkName: network.name,
      ipAddress: newNIC.ipAddress || undefined,
      status: 'disconnected'
    };

    setVMs(prev => prev.map(vm => 
      vm.id === selectedVM 
        ? { ...vm, nics: [...vm.nics, nic] }
        : vm
    ));

    setNewNIC({ name: '', networkId: '', ipAddress: '' });
    setIsAddNICOpen(false);
    
    toast({
      title: "Virtual NIC Added",
      description: `Added ${nic.name} to ${vms.find(v => v.id === selectedVM)?.name}`
    });
  };

  const toggleNICConnection = (vmId: string, nicId: string) => {
    setVMs(prev => prev.map(vm => 
      vm.id === vmId 
        ? {
            ...vm,
            nics: vm.nics.map(nic => 
              nic.id === nicId 
                ? { 
                    ...nic, 
                    status: nic.status === 'connected' ? 'disconnected' : 'connected' 
                  }
                : nic
            )
          }
        : vm
    ));

    const vm = vms.find(v => v.id === vmId);
    const nic = vm?.nics.find(n => n.id === nicId);
    if (vm && nic) {
      toast({
        title: `NIC ${nic.status === 'connected' ? 'Disconnected' : 'Connected'}`,
        description: `${nic.name} on ${vm.name} is now ${nic.status === 'connected' ? 'disconnected' : 'connected'}`
      });
    }
  };

  const startVM = (vmId: string) => {
    setVMs(prev => prev.map(vm => 
      vm.id === vmId ? { ...vm, status: 'running' } : vm
    ));
    
    const vm = vms.find(v => v.id === vmId);
    toast({
      title: "VM Started",
      description: `${vm?.name} is now running`
    });
  };

  const stopVM = (vmId: string) => {
    setVMs(prev => prev.map(vm => 
      vm.id === vmId ? { ...vm, status: 'stopped' } : vm
    ));
    
    const vm = vms.find(v => v.id === vmId);
    toast({
      title: "VM Stopped",
      description: `${vm?.name} has been stopped`
    });
  };

  const pauseVM = (vmId: string) => {
    setVMs(prev => prev.map(vm => 
      vm.id === vmId ? { ...vm, status: 'paused' } : vm
    ));
    
    const vm = vms.find(v => v.id === vmId);
    toast({
      title: "VM Paused",
      description: `${vm?.name} has been paused`
    });
  };

  const deleteVM = (vmId: string) => {
    const vm = vms.find(v => v.id === vmId);
    setVMs(prev => prev.filter(v => v.id !== vmId));
    
    if (vm) {
      toast({
        title: "VM Deleted",
        description: `${vm.name} has been removed`
      });
    }
  };

  const removeNIC = (vmId: string, nicId: string) => {
    setVMs(prev => prev.map(vm => 
      vm.id === vmId 
        ? { ...vm, nics: vm.nics.filter(nic => nic.id !== nicId) }
        : vm
    ));
    
    toast({
      title: "NIC Removed",
      description: "Virtual network interface has been removed"
    });
  };

  const configureVM = (vm: VirtualMachine) => {
    toast({
      title: "VM Configuration",
      description: `Opening configuration panel for ${vm.name}...`
    });
  };

  const connectedHosts = hosts.filter(h => h.status === 'connected');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Virtual Machine Management</h2>
          <p className="text-gray-600">Manage VMs and their network connections</p>
        </div>
        
        <div className="flex space-x-2">
          <Dialog open={isAddNICOpen} onOpenChange={setIsAddNICOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" disabled={vms.length === 0 || networks.length === 0}>
                <Network className="mr-2 h-4 w-4" />
                Add Virtual NIC
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Virtual NIC</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Select Virtual Machine</Label>
                  <Select value={selectedVM} onValueChange={setSelectedVM}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose VM" />
                    </SelectTrigger>
                    <SelectContent>
                      {vms.map(vm => (
                        <SelectItem key={vm.id} value={vm.id}>
                          {vm.name} ({vm.hostName})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="nicName">NIC Name</Label>
                  <Input
                    id="nicName"
                    placeholder="e.g., eth0"
                    value={newNIC.name}
                    onChange={(e) => setNewNIC(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div>
                  <Label>Virtual Network</Label>
                  <Select value={newNIC.networkId} onValueChange={(value) => setNewNIC(prev => ({ ...prev, networkId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose Network" />
                    </SelectTrigger>
                    <SelectContent>
                      {networks.map(network => (
                        <SelectItem key={network.id} value={network.id}>
                          {network.name} ({network.subnet})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="ipAddress">Static IP Address (Optional)</Label>
                  <Input
                    id="ipAddress"
                    placeholder="e.g., 192.168.1.100"
                    value={newNIC.ipAddress}
                    onChange={(e) => setNewNIC(prev => ({ ...prev, ipAddress: e.target.value }))}
                  />
                </div>

                <Button onClick={addNICToVM} className="w-full">
                  Add Virtual NIC
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isCreateVMOpen} onOpenChange={setIsCreateVMOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700" disabled={connectedHosts.length === 0}>
                <Plus className="mr-2 h-4 w-4" />
                Create VM
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Virtual Machine</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="vmName">VM Name</Label>
                  <Input
                    id="vmName"
                    placeholder="e.g., web-server-01"
                    value={newVM.name}
                    onChange={(e) => setNewVM(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div>
                  <Label>Host</Label>
                  <Select value={newVM.hostId} onValueChange={(value) => setNewVM(prev => ({ ...prev, hostId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose Host" />
                    </SelectTrigger>
                    <SelectContent>
                      {connectedHosts.map(host => (
                        <SelectItem key={host.id} value={host.id}>
                          {host.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={createVM} className="w-full">
                  Create VM
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {vms.map((vm) => (
          <Card key={vm.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Monitor className="mr-2 h-5 w-5 text-blue-600" />
                  {vm.name}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={vm.status === 'running' ? 'default' : 'secondary'}
                    className={
                      vm.status === 'running' ? 'bg-green-100 text-green-800' : 
                      vm.status === 'paused' ? 'bg-yellow-100 text-yellow-800' : ''
                    }
                  >
                    {vm.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm">
                  <span className="font-medium">Host:</span> {vm.hostName}
                </div>

                {/* VM Power Controls */}
                <div className="flex space-x-2">
                  {vm.status === 'stopped' && (
                    <Button size="sm" onClick={() => startVM(vm.id)} className="bg-green-600 hover:bg-green-700">
                      <Play className="h-4 w-4 mr-1" />
                      Start
                    </Button>
                  )}
                  {vm.status === 'running' && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => pauseVM(vm.id)}>
                        <Pause className="h-4 w-4 mr-1" />
                        Pause
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => stopVM(vm.id)}>
                        <Square className="h-4 w-4 mr-1" />
                        Stop
                      </Button>
                    </>
                  )}
                  {vm.status === 'paused' && (
                    <>
                      <Button size="sm" onClick={() => startVM(vm.id)} className="bg-green-600 hover:bg-green-700">
                        <Play className="h-4 w-4 mr-1" />
                        Resume
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => stopVM(vm.id)}>
                        <Square className="h-4 w-4 mr-1" />
                        Stop
                      </Button>
                    </>
                  )}
                  <Button size="sm" variant="outline" onClick={() => configureVM(vm)}>
                    <Settings className="h-4 w-4 mr-1" />
                    Configure
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => deleteVM(vm.id)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Virtual NICs ({vm.nics.length})</h4>
                  {vm.nics.length === 0 ? (
                    <p className="text-gray-500 text-sm">No network interfaces configured</p>
                  ) : (
                    <div className="space-y-2">
                      {vm.nics.map(nic => (
                        <div key={nic.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <Wifi className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">{nic.name}</span>
                              <Badge 
                                variant={nic.status === 'connected' ? 'default' : 'secondary'}
                                className={nic.status === 'connected' ? 'bg-green-100 text-green-800' : ''}
                              >
                                {nic.status}
                              </Badge>
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              <div>Network: {nic.networkName}</div>
                              <div>MAC: {nic.macAddress}</div>
                              {nic.ipAddress && <div>IP: {nic.ipAddress}</div>}
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleNICConnection(vm.id, nic.id)}
                            >
                              {nic.status === 'connected' ? 'Disconnect' : 'Connect'}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => removeNIC(vm.id, nic.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {vms.length === 0 && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Monitor className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg font-medium">No Virtual Machines</p>
            <p className="text-gray-400 text-sm text-center">
              Create VMs to connect them to your virtual networks
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
