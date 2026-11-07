-- 2026-11-05 | Normaris v0.1 | Applied to OMNIX AI project bdxqxunosdkdvnxuamid.
-- No legal corpus has been ingested. This schema is isolated from omnix_audit.
create table if not exists public.normaris_organizations (
 id uuid primary key default gen_random_uuid(),
 name text not null check (char_length(name) between 2 and 180),
 created_at timestamptz not null default now()
);
create table if not exists public.normaris_memberships (
 organization_id uuid not null references public.normaris_organizations(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 role text not null default 'researcher' check (role in ('owner','reviewer','researcher','auditor')),
 created_at timestamptz not null default now(),
 primary key (organization_id,user_id)
);
create table if not exists public.normaris_source_documents (
 id uuid primary key default gen_random_uuid(),
 organization_id uuid not null references public.normaris_organizations(id) on delete cascade,
 canonical_url text not null check (canonical_url ~ '^https://'),
 official_issuer text not null,
 source_type text not null check (source_type in ('cosit','rfb_normas','siconfi','other_official')),
 title text not null,
 content text,
 content_sha256 text check (content_sha256 is null or content_sha256 ~ '^[0-9a-f]{64}$'),
 published_at date,
 validity_status text not null default 'not_verified' check (validity_status in ('not_verified','current_verified','superseded','revoked','unknown')),
 validity_checked_at timestamptz,
 collector_method text not null default 'not_collected',
 last_fetched_at timestamptz,
 created_at timestamptz not null default now(),
 unique (organization_id,canonical_url)
);
create table if not exists public.normaris_research_events (
 id uuid primary key default gen_random_uuid(),
 organization_id uuid not null references public.normaris_organizations(id) on delete cascade,
 actor_id uuid references auth.users(id),
 query_sha256 text check (query_sha256 is null or query_sha256 ~ '^[0-9a-f]{64}$'),
 source_document_ids uuid[] not null default '{}',
 model_id text,
 evidence_state text not null default 'unverified' check (evidence_state in ('unverified','references_found','human_reviewed','rejected')),
 human_reviewer_id uuid references auth.users(id),
 human_reviewed_at timestamptz,
 created_at timestamptz not null default now()
);
create index if not exists idx_normaris_memberships_user on public.normaris_memberships(user_id);
create index if not exists idx_normaris_docs_org_type on public.normaris_source_documents(organization_id,source_type);
create index if not exists idx_normaris_events_org_created on public.normaris_research_events(organization_id,created_at desc);
alter table public.normaris_organizations enable row level security;
alter table public.normaris_memberships enable row level security;
alter table public.normaris_source_documents enable row level security;
alter table public.normaris_research_events enable row level security;
create policy normaris_memberships_read_own on public.normaris_memberships for select to authenticated using (user_id=auth.uid());
create policy normaris_orgs_read_member on public.normaris_organizations for select to authenticated using (exists(select 1 from public.normaris_memberships m where m.organization_id=id and m.user_id=auth.uid()));
create policy normaris_docs_read_member on public.normaris_source_documents for select to authenticated using (exists(select 1 from public.normaris_memberships m where m.organization_id=normaris_source_documents.organization_id and m.user_id=auth.uid()));
create policy normaris_events_read_member on public.normaris_research_events for select to authenticated using (exists(select 1 from public.normaris_memberships m where m.organization_id=normaris_research_events.organization_id and m.user_id=auth.uid()));
comment on table public.normaris_source_documents is 'Isolated fiscal corpus metadata; no collection, RAG, or legal opinion results from schema alone.';
