-- Database Structure

CREATE TABLE public.criteria (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  name text NOT NULL,
  description text NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  active boolean NOT NULL DEFAULT true,
  matrix_id uuid NOT NULL,
  weight numeric NOT NULL,
  CONSTRAINT criteria_pkey PRIMARY KEY (id),
  CONSTRAINT criteria_matrix_id_fkey FOREIGN KEY (matrix_id) REFERENCES matrices(id),
  CONSTRAINT criteria_weight_check CHECK (((weight >= (0)::numeric) AND (weight <= (1)::numeric)))
);

CREATE TABLE public.matrices (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  name text NOT NULL,
  description text NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  active boolean NOT NULL DEFAULT true,
  owner_id uuid NOT NULL,
  CONSTRAINT matrices_pkey PRIMARY KEY (id),
  CONSTRAINT matrices_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE TABLE public.option_criteria (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  option_id uuid NOT NULL,
  criterion_id uuid NOT NULL,
  score integer NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  active boolean NOT NULL DEFAULT true,
  CONSTRAINT option_criteria_pkey PRIMARY KEY (id),
  CONSTRAINT option_criteria_option_id_criterion_id_key UNIQUE (option_id, criterion_id),
  CONSTRAINT option_criteria_criterion_id_fkey FOREIGN KEY (criterion_id) REFERENCES criteria(id),
  CONSTRAINT option_criteria_option_id_fkey FOREIGN KEY (option_id) REFERENCES options(id),
  CONSTRAINT option_criteria_score_check CHECK (((score >= 0) AND (score <= 5)))
);

CREATE TABLE public.options (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  name text NOT NULL,
  description text NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  active boolean NOT NULL DEFAULT true,
  matrix_id uuid NOT NULL,
  CONSTRAINT options_pkey PRIMARY KEY (id),
  CONSTRAINT options_matrix_id_fkey FOREIGN KEY (matrix_id) REFERENCES matrices(id)
);

CREATE TABLE public.user_matrices (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  user_id uuid NOT NULL,
  matrix_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  active boolean NOT NULL DEFAULT true,
  CONSTRAINT user_matrices_pkey PRIMARY KEY (id),
  CONSTRAINT user_matrices_user_id_matrix_id_key UNIQUE (user_id, matrix_id),
  CONSTRAINT user_matrices_matrix_id_fkey FOREIGN KEY (matrix_id) REFERENCES matrices(id),
  CONSTRAINT user_matrices_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE public.users (
  id uuid NOT NULL,
  username text NOT NULL,
  email text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  active boolean NOT NULL DEFAULT true,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_email_key UNIQUE (email)
);

-- Row Level Security Policies

CREATE POLICY "Allow all operations for authenticated users" ON public.users
FOR ALL
TO authenticated
USING (true);

CREATE POLICY "Users can view their own matrix relationships" ON public.user_matrices
FOR SELECT
TO authenticated
USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own matrix relationships" ON public.user_matrices
FOR DELETE
TO authenticated
USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can create their own matrix relationships" ON public.user_matrices
FOR INSERT
TO authenticated
WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own matrix relationships" ON public.user_matrices
FOR UPDATE
TO authenticated
USING ((select auth.uid()) = user_id)
WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can view their own matrices" ON public.matrices
FOR SELECT
TO public
USING ((select auth.uid()) = owner_id);

CREATE POLICY "Users can create matrices" ON public.matrices
FOR INSERT
TO public
WITH CHECK ((select auth.uid()) = owner_id);

CREATE POLICY "Users can update their own matrices" ON public.matrices
FOR UPDATE
TO public
USING ((select auth.uid()) = owner_id)
WITH CHECK ((select auth.uid()) = owner_id);

CREATE POLICY "Users can delete their own matrices" ON public.matrices
FOR DELETE
TO public
USING ((select auth.uid()) = owner_id);