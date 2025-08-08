import { useState, useEffect } from "react";
import { AdminAuth } from "@/components/AdminAuth";
import { Sidebar } from "@/components/layout/Sidebar";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { CampaignManager } from "@/components/campaigns/CampaignManager";
import { ContactUpload } from "@/components/contacts/ContactUpload";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already authenticated
    const isAuth = localStorage.getItem("admin_authenticated");
    if (isAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthentication = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_authenticated");
    setIsAuthenticated(false);
    setActiveTab("dashboard");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "campaigns":
        return <CampaignManager />;
      case "contacts":
        return <div className="p-6"><h1 className="text-3xl font-bold">Contact Management</h1><p className="text-muted-foreground">Contact management features coming soon</p></div>;
      case "templates":
        return <div className="p-6"><h1 className="text-3xl font-bold">Email Templates</h1><p className="text-muted-foreground">Template management features coming soon</p></div>;
      case "analytics":
        return <div className="p-6"><h1 className="text-3xl font-bold">Analytics</h1><p className="text-muted-foreground">Advanced analytics coming soon</p></div>;
      case "upload":
        return <ContactUpload />;
      case "settings":
        return <div className="p-6"><h1 className="text-3xl font-bold">Settings</h1><p className="text-muted-foreground">Settings panel coming soon</p></div>;
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    return <AdminAuth onAuthenticated={handleAuthentication} />;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onLogout={handleLogout}
      />
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;