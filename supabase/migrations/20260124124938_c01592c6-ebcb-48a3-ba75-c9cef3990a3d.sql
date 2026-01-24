-- Remove submission rate limit
-- This allows users to submit unlimited properties per day

-- Drop the trigger first (depends on the function)
DROP TRIGGER IF EXISTS enforce_seller_submission_rate_limit ON public.seller_submissions;

-- Drop the function
DROP FUNCTION IF EXISTS public.check_seller_submission_rate_limit();