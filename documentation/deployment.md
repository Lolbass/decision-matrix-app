# Deployment Guide

This guide outlines the steps to deploy the Decision Matrix application to production.

## Prerequisites

- Node.js (v18+)
- A Supabase account with a configured project
- A hosting service (Vercel, Netlify, AWS, etc.)

## Building for Production

1. Install dependencies:

```bash
npm install
```

2. Create production environment file (`.env.production`):

```
VITE_SUPABASE_URL=your-production-supabase-url
VITE_SUPABASE_ANON_KEY=your-production-supabase-anon-key
```

3. Build the application:

```bash
npm run build
```

This creates optimized files in the `dist` directory.

## Deployment Options

### Option 1: Vercel (Recommended)

1. Install Vercel CLI:

```bash
npm install -g vercel
```

2. Login to Vercel:

```bash
vercel login
```

3. Deploy:

```bash
vercel
```

4. For production:

```bash
vercel --prod
```

### Option 2: Netlify

1. Install Netlify CLI:

```bash
npm install -g netlify-cli
```

2. Login:

```bash
netlify login
```

3. Deploy:

```bash
netlify deploy --dir=dist
```

4. For production:

```bash
netlify deploy --dir=dist --prod
```

### Option 3: Docker

1. Create a `Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

2. Create an `nginx.conf`:

```
server {
  listen 80;
  
  location / {
    root /usr/share/nginx/html;
    index index.html;
    try_files $uri $uri/ /index.html;
  }
}
```

3. Build and run the Docker image:

```bash
docker build -t decision-matrix .
docker run -p 80:80 decision-matrix
```

### Option 4: AWS Amplify

1. Install the Amplify CLI:

```bash
npm install -g @aws-amplify/cli
```

2. Initialize Amplify in your project:

```bash
amplify init
```

3. Add hosting to your Amplify project:

```bash
amplify add hosting
```

Choose the "Hosting with Amplify Console" option for web app deployments.

4. Configure environment variables in Amplify Console for your Supabase credentials.

5. Deploy your application:

```bash
amplify publish
```

6. Set up routing in Amplify Console:
   - Go to Rewrites and Redirects
   - Add a rule to redirect all 404s to `index.html` for SPA routing

7. Connect your GitHub repository for CI/CD through the Amplify Console for automatic deployments.

8. Whitelist your Amplify domain in the Supabase CORS settings.

### Option 5: Traditional Hosting

1. Upload the contents of the `dist` folder to your web server
2. Configure your web server to:
   - Serve `index.html` for all routes
   - Set appropriate caching headers
   - Enable HTTPS

## Environment Configuration

Regardless of hosting choice, ensure:

1. Set environment variables on your hosting platform
2. Configure CORS on your Supabase project for your production domain
3. Enable required Supabase services (Authentication, Database)

## Database Migration

1. Update your Supabase production database:

```bash
supabase link --project-ref your-production-project
supabase db push
```

Or execute the SQL migration script manually in Supabase's SQL editor.

## Post-Deployment Checks

1. Verify authentication flows
2. Check database connections
3. Test CRUD operations
4. Validate RLS policies are working
5. Test public routes and protected routes

## Monitoring and Maintenance

1. Set up error tracking (Sentry, LogRocket)
2. Configure analytics
3. Implement log aggregation
4. Set up status monitoring
5. Establish a CI/CD pipeline for future deployments

## Security Considerations

1. Ensure all API keys are production-specific
2. Review RLS policies for security gaps
3. Implement rate limiting if needed
4. Consider setting up a Web Application Firewall (WAF)
5. Regularly update dependencies