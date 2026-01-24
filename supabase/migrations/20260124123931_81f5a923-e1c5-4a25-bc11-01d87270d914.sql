-- Add multi-unit support columns to seller_submissions
ALTER TABLE seller_submissions
ADD COLUMN is_multi_unit BOOLEAN DEFAULT FALSE,
ADD COLUMN building_name TEXT,
ADD COLUMN unit_number TEXT,
ADD COLUMN parent_submission_id UUID REFERENCES seller_submissions(id);

-- Create index for efficient grouping queries
CREATE INDEX idx_seller_submissions_parent ON seller_submissions(parent_submission_id) WHERE parent_submission_id IS NOT NULL;
CREATE INDEX idx_seller_submissions_building ON seller_submissions(building_name) WHERE building_name IS NOT NULL;