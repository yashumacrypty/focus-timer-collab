
-- Create sprints table
CREATE TABLE IF NOT EXISTS public.sprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  workspace_id TEXT NOT NULL,
  is_active BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL,
  reporter_id TEXT NOT NULL,
  doer_id TEXT,
  estimated_time INTEGER NOT NULL,
  sprint_id UUID REFERENCES public.sprints(id),
  workspace_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add RLS policies for sprints
ALTER TABLE public.sprints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sprints" 
ON public.sprints 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sprints" 
ON public.sprints 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sprints" 
ON public.sprints 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sprints" 
ON public.sprints 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add RLS policies for tasks
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tasks" 
ON public.tasks 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks" 
ON public.tasks 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks" 
ON public.tasks 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks" 
ON public.tasks 
FOR DELETE 
USING (auth.uid() = user_id);
