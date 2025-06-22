# Application Flow

This document describes the typical user flow and data flow within the Decision Matrix application.

## User Flow

1. **Authentication**
   - User logs in or creates a new account
   - Auth state is managed by Supabase Auth

2. **Matrices Dashboard**
   - User views a list of their decision matrices
   - User can create a new matrix or open an existing one

3. **Matrix Editing**
   - User defines the decision problem by adding/editing:
     - Criteria with weights
     - Options to compare
     - Scores for each option against each criterion

4. **Results Review**
   - User views calculated scores and analysis
   - Results are dynamically updated as inputs change

5. **Sharing (Optional)**
   - User can share matrices with others

## Data Flow

```
┌──────────┐     ┌────────────┐     ┌─────────────┐     ┌────────────┐
│  Browser │────▶│ React App  │────▶│  Services   │────▶│  Supabase  │
└──────────┘     └────────────┘     └─────────────┘     └────────────┘
      ▲                 ▲                  │                  │
      │                 │                  │                  │
      └─────────────────┴──────────────────┴──────────────────┘
```

### Creating a New Matrix

1. User clicks "Create Matrix" in the UI
2. `useMatrix` hook calls `createMatrix` from `matrixService`
3. `matrixService` sends request to Supabase
4. New matrix is created in database and ID is returned
5. User is redirected to the matrix edit page

### Adding Criteria

1. User enters criteria details
2. `useCriteria` hook calls `createCriterion` from `criteriaService`
3. `criteriaService` sends request to Supabase
4. New criterion is created and associated with the matrix
5. UI updates to show the new criterion

### Scoring Options

1. User selects scores for options against criteria (1-10 scale)
2. `useOptions` hook calls `setScore` from `optionCriteriaService`
3. Score is saved to the database with validation (0-10 range)
4. `useScores` hook recalculates weighted total scores
5. Results view is updated with new calculations and visualizations

## Component Interaction

```
MatrixApp
   │
   ├─── EditableTitle ────► Matrix name/description
   │
   ├─── CriteriaManager ──► useCriteria ──► criteriaService ──► Database
   │
   ├─── OptionsManager ───► useOptions ───► optionsService ───► Database
   │                                    └─► optionCriteriaService
   └─── Results ──────────► useScores ────► scoreCalculator
```