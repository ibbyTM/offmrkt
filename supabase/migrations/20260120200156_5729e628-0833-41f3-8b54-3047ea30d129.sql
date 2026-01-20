-- Add investor context columns to mortgage_referrals for enriched lead tracking
ALTER TABLE public.mortgage_referrals
ADD COLUMN min_budget integer,
ADD COLUMN max_budget integer,
ADD COLUMN cash_available text,
ADD COLUMN mortgage_approved boolean,
ADD COLUMN funding_source text,
ADD COLUMN purchase_timeline text,
ADD COLUMN investment_experience text,
ADD COLUMN properties_owned integer,
ADD COLUMN needs_mortgage_broker boolean,
ADD COLUMN investor_name text,
ADD COLUMN investor_email text,
ADD COLUMN investor_phone text;