-- =============================================
-- SEED DATA FOR DEVELOPMENT
-- =============================================

-- Note: This seed assumes you have at least one user authenticated via GitHub OAuth
-- The user_id below should be replaced with actual auth.users.id after first login

-- Update existing users with skills and badges for profile testing
UPDATE public.users 
SET 
  skills = ARRAY['React', 'TypeScript', 'Node.js', 'GraphQL', 'Docker'],
  badges = ARRAY['First Post', 'Top Contributor', 'Mentor', 'Open Source Hero'],
  activity_stats = '{"posts": 15, "comments": 42, "tribes": 3, "joined_at": "2024-01-15T00:00:00Z"}'::jsonb
WHERE id = (SELECT id FROM auth.users LIMIT 1);

-- Insert sample users (you'll need to replace these IDs with real ones from auth.users)
-- For now, we'll create placeholder data that can be updated after first GitHub login

-- Sample Tribes
INSERT INTO public.tribes (name, slug, description, visibility, created_by) VALUES
  ('React Developers', 'react-developers-abc123', 'A community for React enthusiasts and professionals', 'public', (SELECT id FROM auth.users LIMIT 1)),
  ('TypeScript Masters', 'typescript-masters-def456', 'Deep dive into TypeScript best practices', 'public', (SELECT id FROM auth.users LIMIT 1)),
  ('Open Source Contributors', 'open-source-contributors-ghi789', 'Collaborate on open source projects', 'public', (SELECT id FROM auth.users LIMIT 1)),
  ('Web3 Builders', 'web3-builders-jkl012', 'Building the decentralized future', 'private', (SELECT id FROM auth.users LIMIT 1)),
  ('DevOps Engineers', 'devops-engineers-mno345', 'Infrastructure, CI/CD, and cloud technologies', 'public', (SELECT id FROM auth.users LIMIT 1)),
  ('HashTribe Test Lab', 'hashtribe-test-lab-xyz001', 'Sandbox tribe for testing emoji and image posts', 'public', (SELECT id FROM auth.users LIMIT 1))
ON CONFLICT (slug) DO NOTHING;

-- Sample Topics (will be created after tribes exist)
INSERT INTO public.topics (tribe_id, title, content, created_by) VALUES
  (
    (SELECT id FROM public.tribes WHERE slug = 'react-developers-abc123'),
    'Best practices for React 19',
    'What are your thoughts on the new React 19 features? Let''s discuss the compiler and server components.',
    (SELECT id FROM auth.users LIMIT 1)
  ),
  (
    (SELECT id FROM public.tribes WHERE slug = 'typescript-masters-def456'),
    'Generic constraints in TypeScript 5.3',
    'How do you handle complex generic constraints? Share your patterns and solutions.',
    (SELECT id FROM auth.users LIMIT 1)
  ),
  (
    (SELECT id FROM public.tribes WHERE slug = 'open-source-contributors-ghi789'),
    'Looking for contributors: Modern Icon Pack',
    'We''re building a comprehensive icon library. Need help with SVG optimization and React component generation.',
    (SELECT id FROM auth.users LIMIT 1)
  )
ON CONFLICT DO NOTHING;

INSERT INTO public.posts (id, tribe_id, user_id, content, image_urls, parent_id, likes_count, replies_count, reposts_count)
SELECT
  '8b6f6f41-9d4c-4a1c-9f23-9c8c9a6a9d01'::uuid,
  t.id,
  u.id,
  'Testing emojis 😀🔥 — this is the main post for image/emoji validation.',
  ARRAY['https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80'],
  NULL,
  0,
  2,
  0
FROM (SELECT id FROM public.tribes WHERE slug = 'hashtribe-test-lab-xyz001' LIMIT 1) t
CROSS JOIN (SELECT id FROM auth.users LIMIT 1) u
UNION ALL
SELECT
  'f0c6a8c9-3b8a-4b2c-9c1d-0d6f9a5b3f11'::uuid,
  t.id,
  u.id,
  'Reply: image renders and emoji picker works 👍',
  NULL,
  '8b6f6f41-9d4c-4a1c-9f23-9c8c9a6a9d01'::uuid,
  0,
  0,
  0
FROM (SELECT id FROM public.tribes WHERE slug = 'hashtribe-test-lab-xyz001' LIMIT 1) t
CROSS JOIN (SELECT id FROM auth.users LIMIT 1) u
UNION ALL
SELECT
  'c2f4e6e1-7a8b-4b0f-8b21-6c7b9c1a2d22'::uuid,
  t.id,
  u.id,
  'Reply: emojis ✅🚀 inserted correctly.',
  NULL,
  '8b6f6f41-9d4c-4a1c-9f23-9c8c9a6a9d01'::uuid,
  0,
  0,
  0
FROM (SELECT id FROM public.tribes WHERE slug = 'hashtribe-test-lab-xyz001' LIMIT 1) t
CROSS JOIN (SELECT id FROM auth.users LIMIT 1) u
UNION ALL
SELECT
  'c9b7c0b3-2c45-4e14-8f17-31b7a3c0a901'::uuid,
  t.id,
  u.id,
  'Second post without image to verify text-only flow.',
  NULL,
  NULL,
  0,
  0,
  0
FROM (SELECT id FROM public.tribes WHERE slug = 'hashtribe-test-lab-xyz001' LIMIT 1) t
CROSS JOIN (SELECT id FROM auth.users LIMIT 1) u
ON CONFLICT (id) DO NOTHING;

-- Sample Competitions
INSERT INTO public.competitions (title, slug, description, difficulty, status, start_time, end_time, created_by) VALUES
  (
    'Weekly Algorithm Challenge #1',
    'weekly-algo-challenge-1-abc123',
    'Solve 3 algorithm problems in 2 hours. Topics: Arrays, Strings, Dynamic Programming',
    'medium',
    'upcoming',
    NOW() + INTERVAL '2 days',
    NOW() + INTERVAL '2 days 2 hours',
    (SELECT id FROM auth.users LIMIT 1)
  ),
  (
    'React Component Design Contest',
    'react-component-design-xyz789',
    'Build the most reusable and elegant React component. Judged on code quality, accessibility, and design.',
    'hard',
    'upcoming',
    NOW() + INTERVAL '5 days',
    NOW() + INTERVAL '7 days',
    (SELECT id FROM auth.users LIMIT 1)
  ),
  (
    'Beginner Friendly: First Contribution',
    'beginner-first-contribution-def456',
    'Perfect for newcomers! Complete simple coding tasks and learn Git workflow.',
    'easy',
    'live',
    NOW() - INTERVAL '1 day',
    NOW() + INTERVAL '6 days',
    (SELECT id FROM auth.users LIMIT 1)
  )
ON CONFLICT (slug) DO NOTHING;

-- Note: Tribe members are auto-created via trigger for tribe creators
-- Additional members can be added after user authentication
