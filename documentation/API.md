# API Documentation

This document outlines the backend service APIs available in the Decision Matrix application.

## Authentication API

### `authService.ts`

```typescript
// Sign up with email and password
signUp(email: string, password: string, username: string): Promise<AuthResponse>

// Sign in with email and password
signIn(email: string, password: string): Promise<AuthResponse>

// Sign out current user
signOut(): Promise<void>

// Get current user
getCurrentUser(): Promise<User | null>

// Reset password
resetPassword(email: string): Promise<ResetPasswordResponse>
```

## Matrix API

### `matrixService.ts`

```typescript
// Create a new matrix
createMatrix(name: string, description?: string): Promise<Matrix>

// Get a matrix by ID
getMatrix(id: string): Promise<Matrix>

// Update a matrix
updateMatrix(id: string, updates: Partial<Matrix>): Promise<Matrix>

// Delete a matrix
deleteMatrix(id: string): Promise<void>
```

## Criteria API

### `criteriaService.ts`

```typescript
// Create a new criterion
createCriterion(matrixId: string, name: string, weight: number, description?: string): Promise<Criterion>

// Get criteria for a matrix
getCriteriaForMatrix(matrixId: string): Promise<Criterion[]>

// Update a criterion
updateCriterion(id: string, updates: Partial<Criterion>): Promise<Criterion>

// Delete a criterion
deleteCriterion(id: string): Promise<void>
```

## Options API

### `optionsService.ts`

```typescript
// Create a new option
createOption(matrixId: string, name: string, description?: string): Promise<Option>

// Get options for a matrix
getOptionsForMatrix(matrixId: string): Promise<Option[]>

// Update an option
updateOption(id: string, updates: Partial<Option>): Promise<Option>

// Delete an option
deleteOption(id: string): Promise<void>
```

## Scoring API

### `optionCriteriaService.ts`

The scoring system uses a **1-10 scale** where:
- **0**: No score assigned (default)
- **1**: Lowest score (poor performance against criterion)  
- **10**: Highest score (excellent performance against criterion)

```typescript
// Set a score for an option against a criterion
// score: number (0-10, where 0 = no score, 1-10 = scoring scale)
setScore(optionId: string, criterionId: string, score: number): Promise<void>

// Get scores for an option
getScoresForOption(optionId: string): Promise<OptionCriteriaScore[]>

// Get all scores for a matrix
getScoresForMatrix(matrixId: string): Promise<OptionCriteriaScore[]>
```

## Response Types

```typescript
// Matrix
interface Matrix {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

// Criterion
interface Criterion {
  id: string;
  matrix_id: string;
  name: string;
  weight: number;
  description: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

// Option
interface Option {
  id: string;
  matrix_id: string;
  name: string;
  description: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

// Score
interface OptionCriteriaScore {
  option_id: string;
  criterion_id: string;
  score: number; // 0-10 (0 = no score, 1-10 = scoring scale)
  created_at: string;
  updated_at: string;
}
```