-- Quote form leads (inserted only from Next.js API route using service_role key)
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text,
  phone text,
  address text not null,
  message text not null,
  source text not null default '305doors-web',
  business text
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);

comment on table public.leads is 'Website quote requests; written by server with SUPABASE_SECRET_KEY only.';

alter table public.leads enable row level security;

-- No GRANT to anon/authenticated for insert — only the service role (used server-side) bypasses RLS.
