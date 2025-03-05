
import React from 'react';
import { Layout } from '@/components/Layout';
import { useWorkspace } from '@/context/WorkspaceContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Plus, Mail, Users } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Team = () => {
  const { workspace } = useWorkspace();
  const { toast } = useToast();
  
  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Invitation sent",
      description: "Your team member will receive an email invitation.",
    });
  };
  
  return (
    <Layout>
      <div className="mb-6 animate-slide-down">
        <h1 className="text-2xl font-semibold mb-1">Team</h1>
        <p className="text-muted-foreground">
          Manage your workspace members and permissions
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>
                  People with access to {workspace.name}
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Users size={16} className="mr-2" />
                {workspace.members.length} Members
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workspace.members.map((member) => (
                  <div 
                    key={member.id} 
                    className="flex items-center justify-between p-3 border rounded-md"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <div>
                      {member.id === workspace.ownerId ? (
                        <span className="text-xs bg-focus/10 text-focus px-2 py-1 rounded-full">
                          Owner
                        </span>
                      ) : (
                        <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                          Member
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Invite Team Members</CardTitle>
              <CardDescription>
                Send invitations to your colleagues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInvite} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="Email address"
                    className="mb-2"
                  />
                  <Button type="submit" className="w-full">
                    <Mail size={16} className="mr-2" />
                    Send Invitation
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Team;
