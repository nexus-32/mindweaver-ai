# Supabase Edge Function Deployment Guide

## CORS Error Fix for nexus-32.github.io

### Problem
CORS error when accessing Supabase Edge Function from GitHub Pages:
```
Access to fetch at 'https://nonrvmfalscnjmxsvwmi.supabase.co/functions/v1/translate' from origin 'https://nexus-32.github.io' has been blocked by CORS policy
```

### Solution

#### 1. Deploy Edge Function with CORS Headers
```bash
# Navigate to project root
cd c:\Users\Пользователь Windows\Downloads\mindweaver-main\mindweaver-main

# Deploy the translate function
supabase functions deploy translate --no-verify-jwt
```

#### 2. Set Environment Variables
```bash
# Set LOVABLE_API_KEY if needed
supabase secrets set LOVABLE_API_KEY=your_api_key_here
```

#### 3. Verify Function Deployment
```bash
# List deployed functions
supabase functions list

# Test the function
curl -X POST 'https://nonrvmfalscnjmxsvwmi.supabase.co/functions/v1/translate' \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello world", "targetLang": "es"}'
```

### Function Configuration

The `translate` function includes:
- CORS headers for `https://nexus-32.github.io`
- Preflight request handling (OPTIONS)
- Error handling
- Mock translation logic (replace with actual translation service)

### CORS Headers
```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://nexus-32.github.io',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}
```

### Troubleshooting

#### If function still returns CORS errors:
1. Check if function is deployed: `supabase functions list`
2. Verify CORS headers in function response
3. Clear browser cache
4. Check Supabase logs: `supabase functions logs translate`

#### If function returns 404:
1. Ensure function name matches exactly: `translate`
2. Check function is in correct directory: `supabase/functions/translate/`
3. Redeploy function: `supabase functions deploy translate`

#### If function returns 401/403:
1. Check `--no-verify-jwt` flag is used for deployment
2. Verify Supabase keys are correct
3. Check function permissions

### Required Tools
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to project
supabase link --project-ref nonrvmfalscnjmxsvwmi
```

### Environment Variables (.env)
```
VITE_SUPABASE_PROJECT_ID="nonrvmfalscnjmxsvwmi"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
VITE_SUPABASE_URL="https://nonrvmfalscnjmxsvwmi.supabase.co"
```

### Testing from Browser
Open browser console and test:
```javascript
fetch('https://nonrvmfalscnjmxsvwmi.supabase.co/functions/v1/translate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    text: 'Hello world',
    targetLang: 'es'
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```
