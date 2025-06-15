
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Network, Wifi } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VirtualNetwork {
  id: string;
  name: string;
  vxlanId: number;
  subnet: string;
  description: string;
  connectedHosts: string[];
  activeVMs: number;
  status: 'active' | 'provisioning' | 'error';
  created: Date;
}

interface XenServerHost {
  id: string;
  name: string;
  managementIp: string;
  status: 'connected' | 'disconnected';
}

interface Props {
  hosts: XenServerHost[];
  networks: VirtualNetwork[];
  setNetworks: React.Dispatch<React.SetStateAction<VirtualNetwork[]>>;
}

export const VirtualNetworkManagement = ({ hosts, networks, setNetworks }: Props) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newNetwork, setNewNetwork] = useState({
    name: '',
    subnet: '192.168.1.0/24',
    description: '',
    selectedHosts: [] as string[]
  });
  const { toast } = useToast();

  const generateVXLANId = () => {
    const existingIds = networks.map(n => n.vxlanId);
    let id = 100;
    while (existingIds.includes(id)) {
      id++;
    }
    return id;
  };

  const validateSubnet = (subnet: string) => {
    const cidrRegex = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/;
    return cidrRegex.test(subnet);
  };

  const createVirtualNetwork = async () => {
    if (!newNetwork.name || !newNetwork.subnet) {
      toast({
        title: "Missing Information",
        description: "Please provide network name and subnet.",
        variant: "destructive"
      });
      return;
    }

    if (!validateSubnet(newNetwork.subnet)) {
      toast({
        title: "Invalid Subnet",
        description: "Please provide a valid CIDR subnet (e.g., 192.168.1.0/24).",
        variant: "destructive"
      });
      return;
    }

    if (newNetwork.selectedHosts.length < 2) {
      toast({
        title: "Insufficient Hosts",
        description: "Select at least 2 hosts to create an overlay network.",
        variant: "destructive"
      });
      return;
    }

    const vxlanId = generateVXLANId();
    const network: VirtualNetwork = {
      id: `vnet-${Date.now()}`,
      name: newNetwork.name,
      vxlanId,
      subnet: newNetwork.subnet,
      description: newNetwork.description,
      connectedHosts: newNetwork.selectedHosts,
      activeVMs: 0,
      status: 'provisioning',
      created: new Date()
    };

    setNetworks(prev => [...prev, network]);
    
    toast({
      title: "Creating Virtual Network",
      description: `Provisioning VXLAN ${vxlanId} across ${newNetwork.selectedHosts.length} hosts...`
    });

    // Simulate VXLAN provisioning across hosts
    setTimeout(() => {
      setNetworks(prev => prev.map(n => 
        n.id === network.id 
          ? { ...n, status: 'active' as const }
          : n
      ));
      
      toast({
        title: "Virtual Network Active",
        description: `${network.name} is now operational. VXLAN tunnel established between all selected hosts.`
      });
    }, 3000);

    setNewNetwork({
      name: '',
      subnet: '192.168.1.0/24',
      description: '',
      selectedHosts: []
    });
    setIsCreateDialogOpen(false);
  };

  const deleteNetwork = (networkId: string) => {
    const network = networks.find(n => n.id === networkId);
    if (network) {
      setNetworks(prev => prev.filter(n => n.id !== networkId));
      toast({
        title: "Network Deleted",
        description: `Virtual network ${network.name} and its VXLAN tunnel have been removed.`
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Virtual Network Management</h2>
          <p className="text-gray-600">Create and manage VXLAN overlay networks across XenServer hosts</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={hosts.filter(h => h.status === 'connected').length < 2}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Virtual Network
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Virtual Network</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="networkName">Network Name</Label>
                <Input
                  id="networkName"
                  placeholder="e.g., Production-Network"
                  value={newNetwork.name}
                  onChange={(e) => setNewNetwork(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="subnet">Subnet (CIDR)</Label>
                <Input
                  id="subnet"
                  placeholder="e.g., 192.168.1.0/24"
                  value={newNetwork.subnet}
                  onChange={(e) => setNewNetwork(prev => ({ ...prev, subnet: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Network description"
                  value={newNetwork.description}
                  onChange={(e) => setNewNetwork(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div>
                <Label>Select Hosts (Minimum 2 for VXLAN mesh)</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto border rounded p-2">
                  {hosts.filter(h => h.status === 'connected').map(host => (
                    <div key={host.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={host.id}
                        checked={newNetwork.selectedHosts.includes(host.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewNetwork(prev => ({
                              ...prev,
                              selectedHosts: [...prev.selectedHosts, host.id]
                            }));
                          } else {
                            setNewNetwork(prev => ({
                              ...prev,
                              selectedHosts: prev.selectedHosts.filter(id => id !== host.id)
                            }));
                          }
                        }}
                      />
                      <label htmlFor={host.id} className="text-sm flex-1">
                        {host.name} ({host.managementIp})
                      </label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Selected hosts will form a full mesh VXLAN overlay
                </p>
              </div>

              <Button onClick={createVirtualNetwork} className="w-full">
                Create VXLAN Network
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {hosts.filter(h => h.status === 'connected').length < 2 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-yellow-800">
              <Wifi className="h-5 w-5" />
              <span>Connect at least 2 XenServer hosts to create virtual networks</span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {networks.map((network) => (
          <Card key={network.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Network className="mr-2 h-5 w-5 text-blue-600" />
                  {network.name}
                </CardTitle>
                <Badge 
                  variant={
                    network.status === 'active' ? 'default' : 
                    network.status === 'provisioning' ? 'secondary' : 
                    'destructive'
                  }
                  className={
                    network.status === 'active' ? 'bg-green-100 text-green-800' :
                    network.status === 'provisioning' ? 'bg-yellow-100 text-yellow-800' : ''
                  }
                >
                  {network.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">{network.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">VXLAN ID:</span> {network.vxlanId}
                  </div>
                  <div>
                    <span className="font-medium">Subnet:</span> {network.subnet}
                  </div>
                  <div>
                    <span className="font-medium">Connected Hosts:</span> {network.connectedHosts.length}
                  </div>
                  <div>
                    <span className="font-medium">Active VMs:</span> {network.activeVMs}
                  </div>
                </div>

                {network.status === 'active' && (
                  <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                    ✓ VXLAN mesh established - Layer 2 connectivity active across all hosts
                  </div>
                )}

                <div className="flex space-x-2 pt-3">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Topology
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 text-red-600 hover:text-red-700"
                    onClick={() => deleteNetwork(network.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {networks.length === 0 && hosts.filter(h => h.status === 'connected').length >= 2 && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Network className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg font-medium">No Virtual Networks</p>
            <p className="text-gray-400 text-sm text-center">
              Create your first VXLAN overlay network to connect VMs across hosts
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
