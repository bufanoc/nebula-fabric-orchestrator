
import { Bell, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Network Management</h2>
          <p className="text-sm text-gray-600 mt-1">Distributed Virtual Switch Controller</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Controller Online
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              3 Hypervisors Connected
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="relative">
              <Bell size={18} />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-red-500">
                2
              </Badge>
            </Button>
            <Button variant="ghost" size="sm">
              <Settings size={18} />
            </Button>
            <Button variant="ghost" size="sm">
              <User size={18} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
