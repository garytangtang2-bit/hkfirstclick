-- HKfirstclick Supabase Schema (Updated for Credit Buckets)

-- 1. Create a table for public profiles with all credit buckets
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  tier text default 'TRIAL'::text,
  trial_credits integer default 6,
  premium_credits integer default 0,
  topup_credits integer default 0,
  premium_expires_at timestamp with time zone,
  topup_expires_at timestamp with time zone,
  credits integer default 0 -- Legacy column, retained for safety during migration
);

-- 2. Set up Row Level Security (RLS)
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- 3. Trigger to automatically create a profile entry when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, tier, trial_credits, premium_credits, topup_credits)
  values (new.id, 'TRIAL', 6, 0, 0);
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if it exists and recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4. Create itineraries table
create table if not exists public.itineraries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  parent_id uuid references public.itineraries(id) on delete set null,
  title text not null,
  destination text not null,
  start_date date not null,
  end_date date not null,
  itinerary_data jsonb not null,
  preferences jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.itineraries enable row level security;

create policy "Users can view their own itineraries." on public.itineraries
  for select using (auth.uid() = user_id);

create policy "Users can insert their own itineraries." on public.itineraries
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own itineraries." on public.itineraries
  for update using (auth.uid() = user_id);

create policy "Users can delete their own itineraries." on public.itineraries
  for delete using (auth.uid() = user_id);
