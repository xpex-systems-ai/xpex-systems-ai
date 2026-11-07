-- COSIVANT Trust + Commerce v0.2 (future secure persistence only)
-- Creates zero reports, zero paid receipts, no customer accounts. Frontend is not connected.
create table if not exists public.cosivant_evidence_reports (
 id uuid primary key default gen_random_uuid(),
 organization_id uuid not null references public.normaris_organizations(id) on delete cascade,
 query_sha256 text check (query_sha256 is null or query_sha256 ~ '^[0-9a-f]{64}$'),
 canonical_metadata_sha256 text not null check (canonical_metadata_sha256 ~ '^[0-9a-f]{64}$'),
 source_ids text[] not null default '{}',
 evidence_state text not null default 'reference_only' check (evidence_state in ('reference_only','human_review_pending','human_approved','rejected')),
 reviewer_id uuid references auth.users(id),
 reviewed_at timestamptz,
 created_at timestamptz not null default now()
);
create table if not exists public.cosivant_payment_receipts (
 id uuid primary key default gen_random_uuid(),
 organization_id uuid not null references public.normaris_organizations(id) on delete cascade,
 service_code text not null,
 charge_amount_usdc numeric(18,6) not null check (charge_amount_usdc>=0),
 network text,
 provider_name text,
 provider_receipt_id text,
 settlement_state text not null default 'unverified' check (settlement_state in ('unverified','provider_confirmed','rejected','refunded')),
 settlement_verified_at timestamptz,
 created_at timestamptz not null default now(),
 unique(provider_name,provider_receipt_id)
);
create index if not exists idx_cosivant_reports_org on public.cosivant_evidence_reports(organization_id,created_at desc);
create index if not exists idx_cosivant_payments_org on public.cosivant_payment_receipts(organization_id,created_at desc);
alter table public.cosivant_evidence_reports enable row level security;
alter table public.cosivant_payment_receipts enable row level security;
create policy cosivant_reports_read_member on public.cosivant_evidence_reports for select to authenticated
 using (exists(select 1 from public.normaris_memberships m where m.organization_id=cosivant_evidence_reports.organization_id and m.user_id=auth.uid()));
create policy cosivant_receipts_read_member on public.cosivant_payment_receipts for select to authenticated
 using (exists(select 1 from public.normaris_memberships m where m.organization_id=cosivant_payment_receipts.organization_id and m.user_id=auth.uid()));
-- No INSERT/UPDATE/DELETE policy: writes are not enabled for users or public clients.
comment on table public.cosivant_payment_receipts is 'Provider-confirmed records only after independent server-side verification; table is empty and inactive in demo.';
