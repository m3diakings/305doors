-- Remove legacy single "contact" column (form still posts contact; app maps to email / phone)
alter table public.leads drop column if exists contact;
