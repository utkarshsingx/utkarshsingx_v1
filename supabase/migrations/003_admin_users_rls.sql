-- Allow authenticated users to check if their own email is in admin_users.
-- Required for write policies that use: auth.jwt() ->> 'email' IN (SELECT email FROM admin_users)
-- Without this, the subquery returns 0 rows and all admin writes (update/insert) fail silently.
CREATE POLICY "admin_users_self_check" ON admin_users
  FOR SELECT
  USING (auth.jwt() ->> 'email' = email);
