-- Extend users table with additional GitHub data fields and user metrics
-- This migration adds fields for comprehensive GitHub profile data and internal platform metrics

ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS email TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS public_repo_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS followers_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS comments_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS tribes_created_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS points_earned INTEGER DEFAULT 0;

-- Update the handle_new_user function to include default values for new fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (
    id,
    username,
    display_name,
    avatar_url,
    name,
    email,
    public_repo_count,
    followers_count,
    comments_count,
    tribes_created_count,
    points_earned
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'user_name', NEW.raw_user_meta_data->>'preferred_username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'name',
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'public_repos')::INTEGER, 0),
    COALESCE((NEW.raw_user_meta_data->>'followers')::INTEGER, 0),
    0,
    0,
    0
  )
  ON CONFLICT (id) DO UPDATE SET
    updated_at = EXCLUDED.updated_at;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update user metrics when creating a tribe
CREATE OR REPLACE FUNCTION public.increment_tribes_created()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users
  SET tribes_created_count = tribes_created_count + 1,
      points_earned = points_earned + 10,
      updated_at = NOW()
  WHERE id = NEW.created_by;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for tribes creation
DROP TRIGGER IF EXISTS on_tribe_created ON public.tribes;
CREATE TRIGGER on_tribe_created
  AFTER INSERT ON public.tribes
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_tribes_created();

-- Create function to update user metrics when posting a comment
CREATE OR REPLACE FUNCTION public.increment_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users
  SET comments_count = comments_count + 1,
      points_earned = points_earned + 5,
      updated_at = NOW()
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for comments creation
DROP TRIGGER IF EXISTS on_comment_created ON public.comments;
CREATE TRIGGER on_comment_created
  AFTER INSERT ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_comments_count();

-- Create table for storing GitHub repositories
CREATE TABLE IF NOT EXISTS public.github_repositories (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  repo_id BIGINT NOT NULL,
  name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  description TEXT,
  html_url TEXT NOT NULL,
  language TEXT,
  stargazers_count INTEGER DEFAULT 0,
  forks_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  topics TEXT[],
  archived BOOLEAN DEFAULT FALSE,
  fork BOOLEAN DEFAULT FALSE,
  created_at_db TIMESTAMPTZ DEFAULT NOW(),
  updated_at_db TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_github_repos_user_id ON public.github_repositories(user_id);
CREATE INDEX IF NOT EXISTS idx_github_repos_repo_id ON public.github_repositories(repo_id);
CREATE INDEX IF NOT EXISTS idx_github_repos_language ON public.github_repositories(language);