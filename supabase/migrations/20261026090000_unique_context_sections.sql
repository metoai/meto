-- Prevent duplicate sections for the same user concurrently
create unique index if not exists context_sections_user_preset_idx
  on public.context_sections (user_id, section_type)
  where section_type != 'custom';

create unique index if not exists context_sections_user_custom_title_idx
  on public.context_sections (user_id, lower(trim(title)))
  where section_type = 'custom';
