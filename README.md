# Market Operations Assistant
Simple ai chatbot project 

## Stack
- Next.JS App directory
- React 19
- Tailwind and shadcn for styling
- Typescript
- Zod for runtime schema validations
- Netlify [deploy](market-operations-assistant.netlify.app)
- vitest


## Overview 
- main route (/) has the assistant chat. Simple state managed with a reducer
- messages sources citations links to a /dashboard route, passing custom SearchParams to generate different views.**
- implemented auto scroll to bottom in chat view with MutationObserver
- streaming text response with Server sent events and ReadableStreams
- AbortControllerService to intercept in-flight requests

## Project structure

```
  app/                    
    page.tsx              # Assistant main route
    components/           # Shared layout components & utils
              Assistant/  # main components for chat
              ui/         # Shadcn and core components    
    controllers/          # Server logic, server actions & schema validation 
                api.ts    # Zod schemas validatin for straming response
    dashboard/
             page.tsx     # Sample Dashboard page
    api/chat              # Moked streaming API endpoint
  data/                   # Mocked Data
  tests/                  # Simple unit test set up
```

---


## Getting Started

First, run the development server:

```bash
npm run dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Next Steps
**Ideas open for future development**

- Dashboard complete view with dymanic content from data.json
- e2e testing with playwright
- bundle analyzer set up
