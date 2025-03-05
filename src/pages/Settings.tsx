
import React from 'react';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { useWorkspace } from '@/context/WorkspaceContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { User, Settings as SettingsIcon, Bell, Shield, LogOut } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Settings = () => {
  const { user, signOut } = useAuth();
  const { workspace } = useWorkspace();
  const { toast } = useToast();
  
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Settings saved",
      description: "Your changes have been successfully saved.",
    });
  };
  
  const handleLogout = () => {
    signOut();
    window.location.href = '/auth';
  };
  
  return (
    <Layout>
      <div className="mb-6 animate-slide-down">
        <h1 className="text-2xl font-semibold mb-1">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and workspace preferences
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User size={18} className="mr-2" /> 
                Account Settings
              </CardTitle>
              <CardDescription>
                Update your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={user?.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" defaultValue={user?.email} />
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">
                        <Bell size={16} className="inline mr-2" />
                        Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Configure when and how you want to be notified
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-notifications" className="flex-1">
                        Email notifications
                      </Label>
                      <Switch id="email-notifications" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="task-reminders" className="flex-1">
                        Task reminders
                      </Label>
                      <Switch id="task-reminders" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sprint-updates" className="flex-1">
                        Sprint updates
                      </Label>
                      <Switch id="sprint-updates" defaultChecked />
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="justify-between border-t pt-6">
              <Button variant="outline" onClick={handleLogout}>
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
              <Button type="submit" onClick={handleSaveSettings}>
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <SettingsIcon size={18} className="mr-2" />
                Workspace Settings
              </CardTitle>
              <CardDescription>
                Configure {workspace.name} workspace settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="workspace-name">Workspace Name</Label>
                  <Input id="workspace-name" defaultValue={workspace.name} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="workspace-description">Description</Label>
                  <Textarea 
                    id="workspace-description" 
                    defaultValue={workspace.description}
                    rows={3}
                  />
                </div>
                
                <Separator />
                
                <div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">
                        <Shield size={16} className="inline mr-2" />
                        Permissions
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Control what members can do in your workspace
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="members-can-create-tasks" className="flex-1">
                        Members can create tasks
                      </Label>
                      <Switch id="members-can-create-tasks" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="members-can-invite" className="flex-1">
                        Members can invite others
                      </Label>
                      <Switch id="members-can-invite" />
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button type="submit" onClick={handleSaveSettings} className="ml-auto">
                Save Workspace Settings
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
