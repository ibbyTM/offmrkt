-- Add sold_at column to track when property was marked as sold
ALTER TABLE public.properties ADD COLUMN sold_at timestamp with time zone;