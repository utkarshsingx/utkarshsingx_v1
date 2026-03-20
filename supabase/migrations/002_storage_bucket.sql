-- Storage bucket: Create manually in Supabase Dashboard > Storage > New bucket
-- Name: portfolio-assets, Public: ON (for resume/profile images to be readable)
-- Then run the policies below.

-- Public read for all files
CREATE POLICY "portfolio_assets_public_read" ON storage.objects
FOR SELECT USING (bucket_id = 'portfolio-assets');

-- Admin upload: only users in admin_users can insert/update/delete
CREATE POLICY "portfolio_assets_admin_upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'portfolio-assets'
  AND auth.jwt() ->> 'email' IN (SELECT email FROM public.admin_users)
);

CREATE POLICY "portfolio_assets_admin_update" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'portfolio-assets'
  AND auth.jwt() ->> 'email' IN (SELECT email FROM public.admin_users)
);

CREATE POLICY "portfolio_assets_admin_delete" ON storage.objects
FOR DELETE USING (
  bucket_id = 'portfolio-assets'
  AND auth.jwt() ->> 'email' IN (SELECT email FROM public.admin_users)
);
