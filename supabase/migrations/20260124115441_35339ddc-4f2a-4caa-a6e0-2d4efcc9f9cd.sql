-- Create rate limit check function for seller submissions
CREATE OR REPLACE FUNCTION public.check_seller_submission_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
  submission_count INTEGER;
  max_submissions INTEGER := 5;
  time_window INTERVAL := '24 hours';
BEGIN
  -- Count submissions by this user in the time window
  SELECT COUNT(*) INTO submission_count
  FROM public.seller_submissions
  WHERE user_id = NEW.user_id
    AND created_at > NOW() - time_window;

  -- Check if limit exceeded
  IF submission_count >= max_submissions THEN
    RAISE EXCEPTION 'Rate limit exceeded. Maximum % submissions allowed per 24 hours.', max_submissions
      USING ERRCODE = 'P0001';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to enforce rate limit before each insert
CREATE TRIGGER enforce_seller_submission_rate_limit
  BEFORE INSERT ON public.seller_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.check_seller_submission_rate_limit();