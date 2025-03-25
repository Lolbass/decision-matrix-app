-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Create users table
create table users (
    id uuid primary key default uuid_generate_v4(),
    username text not null unique,
    email text not null unique,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    active boolean default true
);

-- Create matrices table
create table matrices (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    description text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    active boolean default true,
    owner_id uuid references users(id) on delete cascade not null
);

-- Create user_matrices junction table
create table user_matrices (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references users(id) on delete cascade not null,
    matrix_id uuid references matrices(id) on delete cascade not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    active boolean default true,
    unique(user_id, matrix_id)
);

-- Create criteria table
create table criteria (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    description text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    active boolean default true,
    matrix_id uuid references matrices(id) on delete cascade not null,
    weight numeric not null check (weight >= 0 and weight <= 1)
);

-- Create options table
create table options (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    description text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    active boolean default true,
    matrix_id uuid references matrices(id) on delete cascade not null
);

-- Create option_criteria table for scores
create table option_criteria (
    id uuid primary key default uuid_generate_v4(),
    option_id uuid references options(id) on delete cascade not null,
    criterion_id uuid references criteria(id) on delete cascade not null,
    score numeric not null check (score >= 0 and score <= 5),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    active boolean default true,
    unique(option_id, criterion_id)
);

-- Create indexes for better query performance
create index idx_matrices_owner on matrices(owner_id);
create index idx_user_matrices_user on user_matrices(user_id);
create index idx_user_matrices_matrix on user_matrices(matrix_id);
create index idx_criteria_matrix on criteria(matrix_id);
create index idx_options_matrix on options(matrix_id);
create index idx_option_criteria_option on option_criteria(option_id);
create index idx_option_criteria_criterion on option_criteria(criterion_id);

-- Enable Row Level Security (RLS)
alter table users enable row level security;
alter table matrices enable row level security;
alter table user_matrices enable row level security;
alter table criteria enable row level security;
alter table options enable row level security;
alter table option_criteria enable row level security;

-- Create RLS policies
-- Users can view their own data
create policy "Users can view own profile"
    on users for select
    using (auth.uid() = id);

create policy "Users can view their matrices"
    on matrices for select
    using (
        owner_id = auth.uid() or
        exists (
            select 1 from user_matrices
            where user_matrices.matrix_id = matrices.id
            and user_matrices.user_id = auth.uid()
        )
    );

create policy "Users can view their user_matrices"
    on user_matrices for select
    using (user_id = auth.uid());

create policy "Users can view matrix criteria"
    on criteria for select
    using (
        exists (
            select 1 from matrices
            where matrices.id = criteria.matrix_id
            and (
                matrices.owner_id = auth.uid() or
                exists (
                    select 1 from user_matrices
                    where user_matrices.matrix_id = matrices.id
                    and user_matrices.user_id = auth.uid()
                )
            )
        )
    );

create policy "Users can view matrix options"
    on options for select
    using (
        exists (
            select 1 from matrices
            where matrices.id = options.matrix_id
            and (
                matrices.owner_id = auth.uid() or
                exists (
                    select 1 from user_matrices
                    where user_matrices.matrix_id = matrices.id
                    and user_matrices.user_id = auth.uid()
                )
            )
        )
    );

create policy "Users can view option scores"
    on option_criteria for select
    using (
        exists (
            select 1 from options
            join matrices on matrices.id = options.matrix_id
            where options.id = option_criteria.option_id
            and (
                matrices.owner_id = auth.uid() or
                exists (
                    select 1 from user_matrices
                    where user_matrices.matrix_id = matrices.id
                    and user_matrices.user_id = auth.uid()
                )
            )
        )
    );

-- Create functions for managing timestamps
create or replace function handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Create triggers for updating timestamps
create trigger set_timestamp
    before update on users
    for each row
    execute function handle_updated_at();

create trigger set_timestamp
    before update on matrices
    for each row
    execute function handle_updated_at();

create trigger set_timestamp
    before update on user_matrices
    for each row
    execute function handle_updated_at();

create trigger set_timestamp
    before update on criteria
    for each row
    execute function handle_updated_at();

create trigger set_timestamp
    before update on options
    for each row
    execute function handle_updated_at();

create trigger set_timestamp
    before update on option_criteria
    for each row
    execute function handle_updated_at(); 