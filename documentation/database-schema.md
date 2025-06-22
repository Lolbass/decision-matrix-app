# Database Schema

The database design follows a relational model implemented in PostgreSQL via Supabase.

## Core Tables

### users
```sql
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL UNIQUE,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

### matrices
```sql
CREATE TABLE IF NOT EXISTS public.matrices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

### criteria
```sql
CREATE TABLE IF NOT EXISTS public.criteria (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    matrix_id UUID NOT NULL REFERENCES public.matrices(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    weight INTEGER NOT NULL DEFAULT 1,
    description TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

### options
```sql
CREATE TABLE IF NOT EXISTS public.options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    matrix_id UUID NOT NULL REFERENCES public.matrices(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

### option_criteria
```sql
CREATE TABLE IF NOT EXISTS public.option_criteria (
    option_id UUID NOT NULL REFERENCES public.options(id) ON DELETE CASCADE,
    criterion_id UUID NOT NULL REFERENCES public.criteria(id) ON DELETE CASCADE,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    PRIMARY KEY (option_id, criterion_id)
);
```

## Row Level Security (RLS) Policies

Each table has RLS policies to ensure users can only access:

1. Matrices they own
2. Related entities (criteria, options) for matrices they own

Example policy for matrices table:

```sql
CREATE POLICY "Users can view their own matrices"
    ON public.matrices FOR SELECT
    USING (auth.uid() = owner_id);
```

## Indexes

```sql
CREATE INDEX IF NOT EXISTS idx_matrices_owner ON public.matrices(owner_id);
CREATE INDEX IF NOT EXISTS idx_criteria_matrix ON public.criteria(matrix_id);
CREATE INDEX IF NOT EXISTS idx_options_matrix ON public.options(matrix_id);
```

## Triggers

Automatic timestamp updates via triggers:

```sql
CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON public.matrices
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();
```