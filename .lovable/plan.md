

## Upload New Logo to Email Assets Storage

The email templates reference `https://uruqmzpihbxzzowrsrny.supabase.co/storage/v1/object/public/email-assets/logo.png`. We need to upload the new wordmark logo to that same path so auth emails display the updated branding.

Since there's no direct storage upload tool available, the approach is:

**1. Create a temporary edge function** (`upload-email-logo`) that:
   - Fetches the new wordmark logo from the app's public preview URL (`/assets/offthemarkets-logo.png`)
   - Uploads it to the `email-assets` bucket as `logo.png` (overwriting the old one)
   - Uses the Supabase service role key for storage access

**2. Deploy and invoke the function** to perform the upload

**3. Delete the temporary edge function** after the upload succeeds (it's a one-time utility)

No email template code changes needed -- they already reference the correct storage path. The logo file simply gets replaced at that path.

