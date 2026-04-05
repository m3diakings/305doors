-- Structured contact (form still sends a single "contact" string)
alter table public.leads add column if not exists email text;
alter table public.leads add column if not exists phone text;
