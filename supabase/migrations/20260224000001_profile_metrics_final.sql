-- =============================================
-- Profile Metrics & Activity Stats Final Setup
-- Ensures all counters update automatically via DB triggers
-- =============================================

-- 1. Ensure all required columns exist on users table
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS name TEXT,
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS full_name TEXT,
  ADD COLUMN IF NOT EXISTS public_repo_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS followers_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS comments_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tribes_created_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS points_earned INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS badges TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS activity_stats JSONB DEFAULT '{}'::jsonb;

-- 2. Function: increment comments_count + points when topic_reply is inserted
CREATE OR REPLACE FUNCTION public.on_topic_reply_created()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Increment comments_count and points_earned on the user
  UPDATE public.users
  SET
    comments_count     = COALESCE(comments_count, 0) + 1,
    points_earned      = COALESCE(points_earned, 0) + 5,
    -- Keep activity_stats JSONB in sync for backwards compat
    activity_stats     = COALESCE(activity_stats, '{}'::jsonb) ||
                           jsonb_build_object(
                             'comments', COALESCE((activity_stats->>'comments')::int, 0) + 1
                           ),
    updated_at         = NOW()
  WHERE id = NEW.created_by;

  RETURN NEW;
END;
$$;

-- Drop existing trigger if any, then recreate
DROP TRIGGER IF EXISTS trg_on_topic_reply_created ON public.topic_replies;
CREATE TRIGGER trg_on_topic_reply_created
  AFTER INSERT ON public.topic_replies
  FOR EACH ROW
  EXECUTE FUNCTION public.on_topic_reply_created();

-- 3. Function: decrement comments_count + points on reply deletion
CREATE OR REPLACE FUNCTION public.on_topic_reply_deleted()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.users
  SET
    comments_count = GREATEST(COALESCE(comments_count, 0) - 1, 0),
    points_earned  = GREATEST(COALESCE(points_earned, 0) - 5, 0),
    activity_stats = COALESCE(activity_stats, '{}'::jsonb) ||
                       jsonb_build_object(
                         'comments', GREATEST(COALESCE((activity_stats->>'comments')::int, 0) - 1, 0)
                       ),
    updated_at     = NOW()
  WHERE id = OLD.created_by;

  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_on_topic_reply_deleted ON public.topic_replies;
CREATE TRIGGER trg_on_topic_reply_deleted
  AFTER DELETE ON public.topic_replies
  FOR EACH ROW
  EXECUTE FUNCTION public.on_topic_reply_deleted();

-- 4. Function: increment tribes_created_count + points when tribe is inserted
CREATE OR REPLACE FUNCTION public.on_tribe_created_metrics()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.users
  SET
    tribes_created_count = COALESCE(tribes_created_count, 0) + 1,
    points_earned        = COALESCE(points_earned, 0) + 10,
    activity_stats       = COALESCE(activity_stats, '{}'::jsonb) ||
                             jsonb_build_object(
                               'tribes', COALESCE((activity_stats->>'tribes')::int, 0) + 1
                             ),
    updated_at           = NOW()
  WHERE id = NEW.created_by;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_on_tribe_created ON public.tribes;
CREATE TRIGGER trg_on_tribe_created
  AFTER INSERT ON public.tribes
  FOR EACH ROW
  EXECUTE FUNCTION public.on_tribe_created_metrics();

-- 5. Function: increment posts activity_stat when post is inserted
CREATE OR REPLACE FUNCTION public.on_post_created_metrics()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.users
  SET
    points_earned  = COALESCE(points_earned, 0) + 2,
    activity_stats = COALESCE(activity_stats, '{}'::jsonb) ||
                       jsonb_build_object(
                         'posts', COALESCE((activity_stats->>'posts')::int, 0) + 1
                       ),
    updated_at     = NOW()
  WHERE id = NEW.user_id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_on_post_created ON public.posts;
CREATE TRIGGER trg_on_post_created
  AFTER INSERT ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.on_post_created_metrics();

-- 6. Backfill existing users' activity_stats with counts from live data
-- (Safe to run multiple times due to ON CONFLICT DO NOTHING approach)
UPDATE public.users u
SET activity_stats = COALESCE(u.activity_stats, '{}'::jsonb) ||
  jsonb_build_object(
    'posts',            COALESCE((SELECT COUNT(*) FROM public.posts WHERE user_id = u.id), 0),
    'comments',         COALESCE((SELECT COUNT(*) FROM public.topic_replies WHERE created_by = u.id), 0),
    'tribes',           COALESCE((SELECT COUNT(*) FROM public.tribes WHERE created_by = u.id), 0),
    'joined_at',        COALESCE(u.activity_stats->>'joined_at', u.created_at::text)
  ),
  comments_count       = COALESCE((SELECT COUNT(*) FROM public.topic_replies WHERE created_by = u.id), 0),
  tribes_created_count = COALESCE((SELECT COUNT(*) FROM public.tribes WHERE created_by = u.id), 0)
WHERE TRUE;

-- 7. Add RLS policy for github_repositories if not already present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'github_repositories' AND policyname = 'Users can view all github repos'
  ) THEN
    CREATE POLICY "Users can view all github repos"
      ON public.github_repositories FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'github_repositories' AND policyname = 'Users can manage own github repos'
  ) THEN
    CREATE POLICY "Users can manage own github repos"
      ON public.github_repositories FOR ALL
      USING (auth.uid() = user_id);
  END IF;
END;
$$;
