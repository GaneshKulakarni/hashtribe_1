-- Enhanced GitHub Profile Sync Trigger
-- This trigger creates a comprehensive user profile when users sign up with GitHub

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
  github_bio TEXT;
  enhanced_bio TEXT;
  display_name TEXT;
BEGIN
  -- Extract username from GitHub metadata
  base_username := COALESCE(
    NEW.raw_user_meta_data->>'user_name',
    NEW.raw_user_meta_data->>'username', 
    SPLIT_PART(NEW.email, '@', 1)
  );
  
  -- Sanitize and create unique username
  base_username := REGEXP_REPLACE(base_username, '[^a-zA-Z0-9_-]', '', 'g');
  final_username := SUBSTRING(base_username FROM 1 FOR 15) || '_' || RIGHT(NEW.id::text, 4);

  -- Get display name from GitHub metadata
  display_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'user_name',
    final_username
  );

  -- Get GitHub bio and create enhanced bio
  github_bio := NEW.raw_user_meta_data->>'bio';
  enhanced_bio := COALESCE(github_bio, 'GitHub developer passionate about open source');
  
  -- If GitHub user, add some flair to the bio
  IF NEW.raw_user_meta_data->>'user_name' IS NOT NULL THEN
    enhanced_bio := enhanced_bio || ' | GitHub: @' || (NEW.raw_user_meta_data->>'user_name');
  END IF;

  INSERT INTO public.users (
    id, 
    username, 
    display_name, 
    full_name,
    avatar_url, 
    github_username, 
    github_id,
    bio,
    skills,
    badges,
    activity_stats
  ) VALUES (
    NEW.id,
    final_username,
    display_name,
    display_name, -- full_name same as display_name initially
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'user_name',
    (NEW.raw_user_meta_data->>'provider_id')::BIGINT,
    enhanced_bio,
    -- Default skills for GitHub users
    ARRAY['Git', 'Open Source', 'Collaboration'],
    -- Default badges for GitHub users
    ARRAY['GitHub Connected', 'Open Source Enthusiast'],
    -- Activity stats with GitHub data
    jsonb_build_object(
      'posts', 0,
      'comments', 0,
      'tribes', 0,
      'joined_at', NEW.created_at,
      'github_connected', true,
      'github_repos', COALESCE((NEW.raw_user_meta_data->>'public_repos')::int, 0),
      'github_followers', COALESCE((NEW.raw_user_meta_data->>'followers')::int, 0),
      'github_stars', 0
    )
  ) ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();