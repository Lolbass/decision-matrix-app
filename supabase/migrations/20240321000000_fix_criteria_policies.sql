-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view criteria for their matrices" ON public.criteria;
DROP POLICY IF EXISTS "Users can create criteria for their matrices" ON public.criteria;
DROP POLICY IF EXISTS "Users can update criteria for their matrices" ON public.criteria;
DROP POLICY IF EXISTS "Users can delete criteria for their matrices" ON public.criteria;

DROP POLICY IF EXISTS "Users can view options for their matrices" ON public.options;
DROP POLICY IF EXISTS "Users can create options for their matrices" ON public.options;
DROP POLICY IF EXISTS "Users can update options for their matrices" ON public.options;
DROP POLICY IF EXISTS "Users can delete options for their matrices" ON public.options;

DROP POLICY IF EXISTS "Users can view scores for their matrices" ON public.option_criteria;
DROP POLICY IF EXISTS "Users can create scores for their matrices" ON public.option_criteria;
DROP POLICY IF EXISTS "Users can update scores for their matrices" ON public.option_criteria;
DROP POLICY IF EXISTS "Users can delete scores for their matrices" ON public.option_criteria;

-- Recreate policies for criteria table
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

-- Recreate policies for options table
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

-- Recreate policies for option_criteria table
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