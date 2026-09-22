-- 1. Add context_version to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS context_version uuid DEFAULT gen_random_uuid();

-- 2. Add context_version to compiled_profiles
ALTER TABLE public.compiled_profiles 
ADD COLUMN IF NOT EXISTS context_version uuid;

-- 3. Create the trigger function
CREATE OR REPLACE FUNCTION public.bump_profile_context_version()
RETURNS trigger AS $$
BEGIN
  -- We update the profiles table for the corresponding user.
  -- Depending on the operation, the user_id is either in NEW or OLD.
  IF (TG_OP = 'DELETE') THEN
    UPDATE public.profiles
    SET context_version = gen_random_uuid(), updated_at = now()
    WHERE id = OLD.user_id;
  ELSE
    UPDATE public.profiles
    SET context_version = gen_random_uuid(), updated_at = now()
    WHERE id = NEW.user_id;
  END IF;
  
  RETURN NULL; -- For AFTER triggers, the return value is ignored.
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Attach the trigger to context_sections
DROP TRIGGER IF EXISTS trg_bump_profile_context_version ON public.context_sections;

CREATE TRIGGER trg_bump_profile_context_version
AFTER INSERT OR UPDATE OR DELETE ON public.context_sections
FOR EACH ROW EXECUTE FUNCTION public.bump_profile_context_version();
