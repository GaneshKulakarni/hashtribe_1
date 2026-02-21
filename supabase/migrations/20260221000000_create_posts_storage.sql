-- Create posts storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('posts', 'posts', true);

-- Allow public to view posts
CREATE POLICY "Posts Viewable by Public" ON storage.objects FOR SELECT USING (bucket_id = 'posts');

-- Allow authenticated users to upload posts
CREATE POLICY "Authenticated users can upload posts" ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'posts');

-- Allow users to manage their own posts
CREATE POLICY "Users can manage own posts" ON storage.objects FOR ALL 
USING (bucket_id = 'posts' AND (storage.foldername(name))[1] = auth.uid()::text);