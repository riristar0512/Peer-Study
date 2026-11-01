create table if not exists schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  region text,
  created_at timestamptz default now()
);

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  school_id uuid references schools(id),
  nickname text,
  grade text,
  created_at timestamptz default now()
);

create table if not exists study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  subject text not null,
  duration_minutes int not null,
  created_at timestamptz default now()
);

create table if not exists todos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  subject text not null,
  done boolean default false,
  created_at timestamptz default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  room_id text not null,
  sender_id uuid references auth.users(id),
  content text not null,
  created_at timestamptz default now()
);