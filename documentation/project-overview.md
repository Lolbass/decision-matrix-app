# Project Overview

Decision Matrix is a web application that helps users make complex decisions by comparing options across multiple criteria. Users can create matrices, define criteria with different weights, score options, and visualize results.

## Key Features

- Matrix creation and management
- Custom criteria with adjustable weights (percentage-based)
- Option management with **1-10 scoring scale**
- Weighted calculation and result visualization
- Matrix sharing capabilities
- User authentication
- Responsive design

## Scoring System

The application uses a **1-10 scoring scale** for evaluating options:
- **1**: Lowest score (poor performance)
- **10**: Highest score (excellent performance)  
- **0**: No score assigned (default state)

Final scores are calculated by multiplying each option's criterion score by the criterion's weight, then summing across all criteria.

## Tech Stack

- **Frontend**: React 19, React Router, CSS
- **Backend**: Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Build Tools**: Vite, TypeScript
- **Testing**: Playwright for end-to-end testing

## Testing Framework

The application includes a comprehensive end-to-end testing suite using Playwright. The tests cover:

- Authentication (login, logout, signup)
- Form validation
- User workflows
- Error handling

The tests are located in the `tests/` directory and can be run with `npm test`.

## Repository Structure

```
- /src
  - /frontend      # React components, hooks, styles
  - /backend       # Services, API integrations
  - /shared        # Shared types and utilities
- /supabase        # Database migrations and configuration
- /tests           # End-to-end tests using Playwright
  - /e2e           # End-to-end test files
  - /utils         # Test helper functions
- /documentation   # Project documentation
```