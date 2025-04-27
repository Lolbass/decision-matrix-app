# Supabase Setup Guide

This guide explains how to set up and configure Supabase for the Decision Matrix application.

## Prerequisites

- A Supabase account (free tier is sufficient for development)
- Basic knowledge of PostgreSQL

## Initial Setup

1. Create a new Supabase project at [https://app.supabase.io](https://app.supabase.io)
2. Note your project URL and anon key from the API settings page

## Database Schema Setup

You can set up your database in two ways:

### Option 1: Using Migration Files

1. Navigate to the SQL Editor in your Supabase dashboard
2. Copy and paste the contents of `/supabase/migrations/combined_schema.sql`
3. Run the SQL script to create all tables, indexes, and RLS policies

### Option 2: Using Supabase CLI

1. Install the Supabase CLI:

```bash
npm install -g supabase
```

2. Initialize Supabase in your project:

```bash
supabase init
```

3. Link to your remote project:

```bash
supabase link --project-ref your-project-ref
```

4. Push the database schema:

```bash
supabase db push
```

## Row Level Security (RLS) Policies

The application relies on RLS policies to ensure data security. The migration script creates the following policies:

- Users can only view, edit, and delete their own matrices
- Users can only manage criteria and options for matrices they own
- Scoring is restricted to matrices owned by the user

## Authentication Setup

The application uses Supabase Auth with email/password authentication:

1. Navigate to Authentication → Providers in your Supabase dashboard
2. Ensure Email provider is enabled
3. Configure any additional settings (password strength, etc.)

## Environment Configuration

Add your Supabase credentials to your environment:

1. Create a `.env` file in the project root:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

2. Restart your development server if it's running

## Testing the Connection

Run the test connection utility to verify your Supabase setup:

```bash
node src/backend/lib/testConnection.ts
```

If successful, you should see a confirmation message in the console.

## Troubleshooting

- **"Invalid API key" error**: Double-check your anon key in the `.env` file
- **RLS policy issues**: Review the policies in SQL Editor → Policies to ensure they're correctly configured
- **Table not found errors**: Verify the migration script ran successfully by checking Tables in your Supabase dashboard