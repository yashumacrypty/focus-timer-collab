
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2 } from 'lucide-react';

const OnboardingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceDesc, setWorkspaceDesc] = useState('');
  
  const handleCreateWorkspace = () => {
    // In a real app, this would create the workspace in the backend
    setStep(2);
  };
  
  const handleComplete = () => {
    navigate('/');
  };
  
  if (!user) {
    navigate('/auth');
    return null;
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-focus">Welcome to Focus To-Do</h1>
          <p className="text-muted-foreground mt-2">Let's get you set up</p>
        </div>
        
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Create Your Workspace</CardTitle>
              <CardDescription>
                Your workspace is where you and your team will collaborate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); handleCreateWorkspace(); }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="workspace-name">Workspace Name</Label>
                  <Input 
                    id="workspace-name" 
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    placeholder="e.g., Marketing Team, Project X"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="workspace-description">Description (Optional)</Label>
                  <Textarea 
                    id="workspace-description" 
                    value={workspaceDesc}
                    onChange={(e) => setWorkspaceDesc(e.target.value)}
                    placeholder="What does your team work on?"
                    rows={3}
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleCreateWorkspace} 
                className="w-full"
                disabled={!workspaceName}
              >
                Create Workspace
              </Button>
            </CardFooter>
          </Card>
        )}
        
        {step === 2 && (
          <Card>
            <CardHeader>
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-center">You're All Set!</CardTitle>
              <CardDescription className="text-center">
                Your workspace has been created successfully
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                You can now create tasks, track time, and collaborate with your team.
              </p>
              <div className="flex flex-col items-center space-y-4">
                <Button onClick={handleComplete} size="lg">
                  Go to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;
