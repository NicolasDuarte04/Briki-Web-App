-- ====================================================================
-- STAGE 3.1  •  ADDITIVE MIGRATION (NON-DESTRUCTIVE)
-- --------------------------------------------------------------------
-- This script ONLY adds the new logging tables and missing columns
-- required for the Briki AI assistant Stage 3.1 features.
-- It is **safe to run multiple times** thanks to the IF NOT EXISTS
-- guards and will NEVER drop or truncate data.
-- ====================================================================

-- 1. Add missing columns to `insurance_plans` -------------------------
ALTER TABLE IF EXISTS public.insurance_plans
    ADD COLUMN IF NOT EXISTS category            varchar,
    ADD COLUMN IF NOT EXISTS coverage_amount     integer,
    ADD COLUMN IF NOT EXISTS currency            varchar(3) DEFAULT 'USD',
    ADD COLUMN IF NOT EXISTS benefits            jsonb       DEFAULT '[]'::jsonb NOT NULL,
    ADD COLUMN IF NOT EXISTS updated_at          timestamp   DEFAULT now();

-- 2. Create logging / analytics tables --------------------------------

-- 2.1 conversation_logs ------------------------------------------------
CREATE TABLE IF NOT EXISTS public.conversation_logs (
    id         serial PRIMARY KEY,
    user_id    integer REFERENCES public.users(id),
    category   varchar(100),
    input      text     NOT NULL,
    output     text,
    timestamp  timestamp DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS conv_logs_user_id_idx   ON public.conversation_logs(user_id);
CREATE INDEX IF NOT EXISTS conv_logs_category_idx  ON public.conversation_logs(category);

-- 2.2 context_snapshots -------------------------------------------------
CREATE TABLE IF NOT EXISTS public.context_snapshots (
    id               serial PRIMARY KEY,
    conversation_id  integer NOT NULL REFERENCES public.conversation_logs(id) ON DELETE CASCADE,
    memory_json      jsonb   NOT NULL,
    created_at       timestamp DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS context_snapshots_conv_id_idx ON public.context_snapshots(conversation_id);

-- 2.3 company_plans ----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.company_plans (
    id               serial PRIMARY KEY,
    company_id       integer,
    plan_id          varchar NOT NULL,
    name             varchar NOT NULL,
    category         varchar,
    base_price       integer,
    coverage_amount  integer,
    provider         varchar,
    created_at       timestamp DEFAULT now(),
    updated_at       timestamp DEFAULT now()
);
CREATE INDEX IF NOT EXISTS company_plans_company_id_idx ON public.company_plans(company_id);
CREATE INDEX IF NOT EXISTS company_plans_category_idx   ON public.company_plans(category);

-- 2.4 plan_analytics ---------------------------------------------------
CREATE TABLE IF NOT EXISTS public.plan_analytics (
    id           serial PRIMARY KEY,
    plan_id      integer NOT NULL REFERENCES public.company_plans(id),
    views        integer DEFAULT 0 NOT NULL,
    comparisons  integer DEFAULT 0 NOT NULL,
    conversions  integer DEFAULT 0 NOT NULL,
    date         timestamp DEFAULT now()
);
CREATE INDEX IF NOT EXISTS plan_analytics_plan_id_idx ON public.plan_analytics(plan_id);
CREATE INDEX IF NOT EXISTS plan_analytics_date_idx    ON public.plan_analytics(date);

-- 2.5 quotes -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quotes (
    id                 serial PRIMARY KEY,
    user_id            integer REFERENCES public.users(id),
    category           varchar NOT NULL,
    details            jsonb   NOT NULL,
    quote_reference    varchar UNIQUE,
    status             varchar DEFAULT 'draft',
    notification_sent  boolean DEFAULT false,
    expires_at         timestamp,
    created_at         timestamp DEFAULT now(),
    updated_at         timestamp DEFAULT now()
);

-- ====================================================================
-- END OF STAGE 3.1 ADDITIVE MIGRATION
-- ==================================================================== 