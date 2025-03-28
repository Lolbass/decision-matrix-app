-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL UNIQUE,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create matrices table
CREATE TABLE IF NOT EXISTS public.matrices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create criteria table
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

-- Create options table
CREATE TABLE IF NOT EXISTS public.options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    matrix_id UUID NOT NULL REFERENCES public.matrices(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create option_criteria table for scores
CREATE TABLE IF NOT EXISTS public.option_criteria (
    option_id UUID NOT NULL REFERENCES public.options(id) ON DELETE CASCADE,
    criterion_id UUID NOT NULL REFERENCES public.criteria(id) ON DELETE CASCADE,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    PRIMARY KEY (option_id, criterion_id)
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matrices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.option_criteria ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own data"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own data"
    ON public.users FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own data"
    ON public.users FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Create policies for matrices table
CREATE POLICY "Users can view their own matrices"
    ON public.matrices FOR SELECT
    USING (auth.uid() = owner_id);

CREATE POLICY "Users can create their own matrices"
    ON public.matrices FOR INSERT
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own matrices"
    ON public.matrices FOR UPDATE
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own matrices"
    ON public.matrices FOR DELETE
    USING (auth.uid() = owner_id);

-- Create policies for criteria table
CREATE POLICY "Users can view criteria for their matrices"
    ON public.criteria FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.matrices
            WHERE matrices.id = criteria.matrix_id
            AND matrices.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can create criteria for their matrices"
    ON public.criteria FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.matrices
            WHERE matrices.id = criteria.matrix_id
            AND matrices.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can update criteria for their matrices"
    ON public.criteria FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.matrices
            WHERE matrices.id = criteria.matrix_id
            AND matrices.owner_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.matrices
            WHERE matrices.id = criteria.matrix_id
            AND matrices.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete criteria for their matrices"
    ON public.criteria FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.matrices
            WHERE matrices.id = criteria.matrix_id
            AND matrices.owner_id = auth.uid()
        )
    );

-- Create policies for options table
CREATE POLICY "Users can view options for their matrices"
    ON public.options FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.matrices
            WHERE matrices.id = options.matrix_id
            AND matrices.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can create options for their matrices"
    ON public.options FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.matrices
            WHERE matrices.id = options.matrix_id
            AND matrices.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can update options for their matrices"
    ON public.options FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.matrices
            WHERE matrices.id = options.matrix_id
            AND matrices.owner_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.matrices
            WHERE matrices.id = options.matrix_id
            AND matrices.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete options for their matrices"
    ON public.options FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.matrices
            WHERE matrices.id = options.matrix_id
            AND matrices.owner_id = auth.uid()
        )
    );

-- Create policies for option_criteria table
CREATE POLICY "Users can view scores for their matrices"
    ON public.option_criteria FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.options
            JOIN public.matrices ON matrices.id = options.matrix_id
            WHERE options.id = option_criteria.option_id
            AND matrices.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can create scores for their matrices"
    ON public.option_criteria FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.options
            JOIN public.matrices ON matrices.id = options.matrix_id
            WHERE options.id = option_criteria.option_id
            AND matrices.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can update scores for their matrices"
    ON public.option_criteria FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.options
            JOIN public.matrices ON matrices.id = options.matrix_id
            WHERE options.id = option_criteria.option_id
            AND matrices.owner_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.options
            JOIN public.matrices ON matrices.id = options.matrix_id
            WHERE options.id = option_criteria.option_id
            AND matrices.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete scores for their matrices"
    ON public.option_criteria FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.options
            JOIN public.matrices ON matrices.id = options.matrix_id
            WHERE options.id = option_criteria.option_id
            AND matrices.owner_id = auth.uid()
        )
    ); 