-- 1. Add sort_order column to courses table
ALTER TABLE public.courses
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- 2. Update existing courses to have a sort_order based on their creation time
WITH numbered_courses AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY mode ORDER BY created_at ASC) - 1 as new_order
  FROM public.courses
)
UPDATE public.courses
SET sort_order = numbered_courses.new_order
FROM numbered_courses
WHERE courses.id = numbered_courses.id;
