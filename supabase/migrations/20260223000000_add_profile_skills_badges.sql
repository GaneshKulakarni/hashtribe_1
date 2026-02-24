-- Add skills and badges fields to users table for profile page redesign
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS badges TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS activity_stats JSONB DEFAULT '{"posts": 0, "comments": 0, "tribes": 0, "joined_at": null}'::jsonb;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_skills ON public.users USING GIN (skills);
CREATE INDEX IF NOT EXISTS idx_users_badges ON public.users USING GIN (badges);

-- Update RLS policies to allow users to update their own skills and badges
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);