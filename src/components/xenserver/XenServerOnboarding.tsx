
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Server, Network, CheckCircle, AlertCircle, Settings, Eye } from "lucide-react";

interface XenServerHost {
  id: string;
  name: string;
  managementIp: string;
  status: 'connecting' | 'connected' | 'error';
  openVSwitchVersion?: string;
  virtualSwitches?: string[];
}

interface Props {
  hosts: XenServerHost[];
  setHosts: React.Dispatch<React.SetStateAction<XenServerHost[]>>;
}

export const XenServerOnboarding = ({ hosts, setHosts }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedHost, setSelectedHost] = useState<XenServerHost | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    managementIp: '',
    username: 'root',
    password: ''
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const handleAddHost = async () => {
    if (!formData.name || !formData.managementIp) {
      toast({
        title: "Missing Information",
        description: "Please provide both host name and management IP address.",
        variant: "destructive"
      });
      return;
    }

    // Validate IP format
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(formData.managementIp)) {
      toast({
        title: "Invalid IP Address",
        description: "Please provide a valid IPv4 address.",
        variant: "destructive"
      });
      return;
    }

    setIsConnecting(true);
    const newHost: XenServerHost = {
      id: `xenserver-${Date.now()}`,
      name: formData.name,
      managementIp: formData.managementIp,
      status: 'connecting'
    };

    setHosts(prev => [...prev, newHost]);

    // Simulate connection process with Open vSwitch detection
    setTimeout(() => {
      setHosts(prev => prev.map(host => 
        host.id === newHost.id 
          ? { 
              ...host, 
              status: 'connected',
              openVSwitchVersion: '2.17.0',
              virtualSwitches: ['xenbr0', 'xapi1', 'xapi2']
            }
          : host
      ));
      
      toast({
        title: "XenServer Host Connected",
        description: `Successfully connected to ${formData.name}. Open vSwitch detected and ready for overlay networks.`
      });
      
      setIsConnecting(false);
      setFormData({ name: '', managementIp: '', username: 'root', password: '' });
      setIsOpen(false);
    }, 3000);
  };

  const removeHost = (hostId: string) => {
    const host = hosts.find(h => h.id === hostId);
    setHosts(prev => prev.filter(h => h.id !== hostId));
    
    if (host) {
      toast({
        title: "Host Removed",
        description: `${host.name} has been disconnected and removed.`
      });
    }
  };

  const viewHostDetails = (host: XenServerHost) => {
    setSelectedHost(host);
    setDetailsDialogOpen(true);
  };

  const configureHost = (host: XenServerHost) => {
    toast({
      title: "Host Configuration",
      description: `Opening configuration panel for ${host.name}...`
    });
    // This would open a configuration dialog in a real implementation
  };

  const retryConnection = (hostId: string) => {
    const host = hosts.find(h => h.id === hostId);
    if (!host) return;

    setHosts(prev => prev.map(h => 
      h.id === hostId 
        ? { ...h, status: 'connecting' }
        : h
    ));

    toast({
      title: "Retrying Connection",
      description: `Attempting to reconnect to ${host.name}...`
    });

    setTimeout(() => {
      setHosts(prev => prev.map(h => 
        h.id === hostId 
          ? { 
              ...h, 
              status: 'connected',
              openVSwitchVersion: '2.17.0',
              virtualSwitches: ['xenbr0', 'xapi1', 'xapi2']
            }
          : h
      ));
      
      toast({
        title: "Connection Restored",
        description: `Successfully reconnected to ${host.name}.`
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">XenServer Host Management</h2>
          <p className="text-gray-600">Connect XenServer hosts to enable virtual network creation</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Add XenServer Host
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Connect XenServer Host</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Host Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., xenserver-prod-01"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="managementIp">Management IP Address</Label>
                <Input
                  id="managementIp"
                  placeholder="e.g., 192.168.1.100"
                  value={formData.managementIp}
                  onChange={(e) => setFormData(prev => ({ ...prev, managementIp: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                />
              </div>
              <Button 
                onClick={handleAddHost} 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isConnecting}
              >
                {isConnecting ? "Connecting..." : "Connect Host"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {hosts.map((host) => (
          <Card key={host.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Server className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold">{host.name}</h3>
                    <p className="text-sm text-gray-600">{host.managementIp}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {host.status === 'connecting' && (
                    <div className="flex items-center text-yellow-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2" />
                      <span className="text-sm">Connecting</span>
                    </div>
                  )}
                  {host.status === 'connected' && (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span className="text-sm">Connected</span>
                    </div>
                  )}
                  {host.status === 'error' && (
                    <div className="flex items-center text-red-600">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <span className="text-sm">Error</span>
                    </div>
                  )}
                </div>
              </div>
              
              {host.status === 'connected' && (
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Network className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Open vSwitch: {host.openVSwitchVersion}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Available Bridges:</p>
                    <div className="flex flex-wrap gap-2">
                      {host.virtualSwitches?.map((vswitch, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {vswitch}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-2 pt-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => viewHostDetails(host)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => configureHost(host)}
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Configure
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => removeHost(host.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              )}

              {host.status === 'error' && (
                <div className="space-y-3">
                  <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    ✗ Connection failed - unable to reach host
                  </div>
                  <div className="flex space-x-2 pt-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => retryConnection(host.id)}
                    >
                      Retry Connection
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => removeHost(host.id)}
                    >
                      Remove Host
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {hosts.length === 0 && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Server className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg font-medium">No XenServer Hosts Connected</p>
            <p className="text-gray-400 text-sm text-center">
              Connect your first XenServer host to begin creating virtual networks
            </p>
          </CardContent>
        </Card>
      )}

      {/* Host Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Host Details</DialogTitle>
          </DialogHeader>
          {selectedHost && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Host Name</Label>
                  <p className="text-sm text-gray-600">{selectedHost.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Management IP</Label>
                  <p className="text-sm text-gray-600">{selectedHost.managementIp}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <p className="text-sm text-gray-600 capitalize">{selectedHost.status}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Open vSwitch Version</Label>
                  <p className="text-sm text-gray-600">{selectedHost.openVSwitchVersion || 'N/A'}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Virtual Switches</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedHost.virtualSwitches?.map((vswitch, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {vswitch}
                    </span>
                  )) || <p className="text-sm text-gray-500">None available</p>}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
