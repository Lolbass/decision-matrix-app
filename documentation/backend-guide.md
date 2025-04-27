# Backend Development Guide

## Services Structure

Backend services are organized by entity and responsibility:

- **authService**: User authentication and session management
- **matrixService**: Matrix CRUD operations
- **criteriaService**: Criteria management
- **optionsService**: Options management
- **optionCriteriaService**: Scoring and relationships
- **sharingService**: Matrix sharing functionality
- **userMatrixService**: User-matrix relationships

## Database Interaction

All database interactions use Supabase client from `src/backend/lib/supabase.ts`.

## Service Pattern

Services follow a consistent pattern:

1. Import Supabase client
2. Define strongly-typed functions for database operations
3. Handle errors with try/catch and throw specific error types
4. Return typed responses

Example service method:

```typescript
async function getMatrix(id: string): Promise<Matrix> {
  try {
    const { data, error } = await supabase
      .from('matrices')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching matrix:', error);
    throw error;
  }
}
```

## Error Handling

Services should throw errors rather than returning them, allowing consistent error handling at the component level.

## Security Considerations

- All database operations should respect user ownership
- Validate input data before database operations
- Use parameterized queries to prevent SQL injection
- Apply appropriate RLS policies in Supabase