-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop triggers first if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS handle_users_updated_at ON public.users;
DROP TRIGGER IF EXISTS handle_matrices_updated_at ON public.matrices;
DROP TRIGGER IF EXISTS handle_criteria_updated_at ON public.criteria;
DROP TRIGGER IF EXISTS handle_options_updated_at ON public.options;
DROP TRIGGER IF EXISTS handle_option_criteria_updated_at ON public.option_criteria;
DROP TRIGGER IF EXISTS handle_user_matrices_updated_at ON public.user_matrices;

-- Drop tables CASCADE to eliminate foreign key constraints if they exist
DROP TABLE IF EXISTS public.user_matrices CASCADE;
DROP TABLE IF EXISTS public.option_criteria CASCADE;
DROP TABLE IF EXISTS public.options CASCADE;
DROP TABLE IF EXISTS public.criteria CASCADE;
DROP TABLE IF EXISTS public.matrices CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY, 
    username TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    active BOOLEAN DEFAULT true NOT NULL
);

-- Create matrices table
CREATE TABLE IF NOT EXISTS public.matrices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    active BOOLEAN DEFAULT true NOT NULL,
    owner_id UUID NOT NULL REFERENCES public.users(id)
);

-- Create criteria table
CREATE TABLE IF NOT EXISTS public.criteria (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    active BOOLEAN DEFAULT true NOT NULL,
    matrix_id UUID NOT NULL REFERENCES public.matrices(id),
    weight DECIMAL NOT NULL CHECK (weight >= 0 AND weight <= 1)
);

-- Create options table
CREATE TABLE IF NOT EXISTS public.options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    active BOOLEAN DEFAULT true NOT NULL,
    matrix_id UUID NOT NULL REFERENCES public.matrices(id)
);

-- Create option_criteria table
CREATE TABLE IF NOT EXISTS public.option_criteria (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    option_id UUID NOT NULL REFERENCES public.options(id),
    criterion_id UUID NOT NULL REFERENCES public.criteria(id),
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    active BOOLEAN DEFAULT true NOT NULL,
    UNIQUE(option_id, criterion_id)
);

-- Create user_matrices table
CREATE TABLE IF NOT EXISTS public.user_matrices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id),
    matrix_id UUID NOT NULL REFERENCES public.matrices(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    active BOOLEAN DEFAULT true NOT NULL,
    UNIQUE(user_id, matrix_id)
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER handle_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_matrices_updated_at
    BEFORE UPDATE ON public.matrices
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_criteria_updated_at
    BEFORE UPDATE ON public.criteria
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_options_updated_at
    BEFORE UPDATE ON public.options
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_option_criteria_updated_at
    BEFORE UPDATE ON public.option_criteria
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_user_matrices_updated_at
    BEFORE UPDATE ON public.user_matrices
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Set up Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matrices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.option_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_matrices ENABLE ROW LEVEL SECURITY;

-- Create policies with proper permissions
-- Users table policies
CREATE POLICY "Allow all operations for authenticated users"
    ON public.users
    USING (true)
    WITH CHECK (true);

-- Matrix policies
CREATE POLICY "Users can view their own matrices"
    ON public.matrices FOR SELECT
    USING (
        owner_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.user_matrices
            WHERE matrix_id = matrices.id
            AND user_id = auth.uid()
            AND active = true
        )
    );

CREATE POLICY "Users can create matrices"
    ON public.matrices FOR INSERT
    WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update their own matrices"
    ON public.matrices FOR UPDATE
    USING (owner_id = auth.uid());

CREATE POLICY "Users can delete their own matrices"
    ON public.matrices FOR DELETE
    USING (owner_id = auth.uid());

-- Similar policies for other tables... 