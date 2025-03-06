
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { User, Settings as SettingsIcon, Bell, LogOut } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Settings = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userMotivation, setUserMotivation] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  
  useEffect(() => {
    if (user) {
      setUserName(user.name || '');
      setUserEmail(user.email || '');
      setUserMotivation(user.motivation || '');
    }
  }, [user]);
  
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      setIsUpdating(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          name: userName,
          motivation: userMotivation
        })
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Settings saved",
        description: "Your changes have been successfully saved.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error saving settings",
        description: "There was a problem saving your changes.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleLogout = () => {
    signOut();
  };
  
  return (
    <Layout>
      <div className="mb-6 animate-slide-down">
        <h1 className="text-2xl font-semibold mb-1">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences
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
                    <Input 
                      id="name" 
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      value={userEmail}
                      disabled
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="motivation">Your Motivation</Label>
                  <Input 
                    id="motivation" 
                    value={userMotivation}
                    onChange={(e) => setUserMotivation(e.target.value)}
                    placeholder="What motivates you to stay productive?"
                  />
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
              <Button 
                type="submit" 
                onClick={handleSaveSettings}
                disabled={isUpdating}
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
