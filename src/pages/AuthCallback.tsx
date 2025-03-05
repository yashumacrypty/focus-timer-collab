
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Check for error query parameters
      const queryParams = new URLSearchParams(window.location.search);
      const errorDescription = queryParams.get('error_description');
      
      if (errorDescription) {
        console.error('Auth callback error:', errorDescription);
        setError(errorDescription);
        toast({
          title: 'Authentication failed',
          description: errorDescription,
          variant: 'destructive',
        });
        
        // Navigate after a short delay to ensure toast is seen
        setTimeout(() => navigate('/auth'), 2000);
        return;
      }

      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting auth session:', error);
          setError(error.message);
          toast({
            title: 'Authentication error',
            description: error.message,
            variant: 'destructive',
          });
          navigate('/auth');
          return;
        }

        if (data?.session) {
          toast({
            title: 'Authentication successful',
            description: 'You have been signed in successfully.',
            variant: 'default',
          });
          navigate('/');
        } else {
          setError('No session found');
          toast({
            title: 'Authentication incomplete',
            description: 'Please try signing in again.',
            variant: 'destructive',
          });
          navigate('/auth');
        }
      } catch (err) {
        console.error('Unexpected error during auth callback:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        toast({
          title: 'Unexpected error',
          description: 'An unexpected error occurred during sign in.',
          variant: 'destructive',
        });
        navigate('/auth');
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-4 text-center">
        <h1 className="text-2xl font-bold">Processing your sign in...</h1>
        
        {error ? (
          <div className="p-4 text-red-800 bg-red-100 rounded-md">
            <p className="font-medium">Authentication failed</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
