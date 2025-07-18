# 🏛️ Phase 2: Modern Frontend Architecture Plan

## 📋 **Overview**

Building a modern, type-safe frontend using Next.js 14, tRPC, and your enterprise foundation from Phase 1.

## 🎯 **Core Technologies**

| Layer | Technology | Purpose | Integration |
|-------|------------|---------|-------------|
| **Frontend** | Next.js 14 + App Router | React SSR/SSG framework | Uses @conduit/utils validation |
| **UI Components** | shadcn/ui + Tailwind CSS | Component library | Consistent design system |
| **API Client** | tRPC Client | Type-safe API calls | Direct integration with server |
| **State Management** | Zustand | Client-side state | Lightweight, TypeScript-first |
| **Forms** | React Hook Form + Zod | Form validation | Reuses validation schemas |
| **Authentication** | NextAuth.js + JWT | Session management | Leverages existing auth logic |

## 📁 **Directory Structure**

```
apps/
├── web/                          # Next.js 14 Frontend
│   ├── app/                      # App Router structure
│   │   ├── (auth)/              # Auth route group
│   │   │   ├── login/           # Login page
│   │   │   └── register/        # Register page
│   │   ├── (dashboard)/         # Protected routes
│   │   │   ├── article/         # Article management
│   │   │   ├── profile/         # User profile
│   │   │   └── settings/        # User settings
│   │   ├── globals.css          # Global styles
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Home page
│   ├── components/              # Reusable components
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── forms/               # Form components
│   │   ├── layout/              # Layout components
│   │   └── features/            # Feature-specific components
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utilities and configuration
│   │   ├── auth.ts              # NextAuth configuration
│   │   ├── trpc.ts              # tRPC client setup
│   │   ├── store.ts             # Zustand store
│   │   └── utils.ts             # Helper functions
│   └── types/                   # Frontend-specific types
├── api/                         # tRPC Server (Fastify)
│   ├── src/
│   │   ├── routers/             # tRPC route definitions
│   │   │   ├── auth.ts          # Authentication routes
│   │   │   ├── articles.ts      # Article CRUD routes
│   │   │   ├── users.ts         # User management routes
│   │   │   └── index.ts         # Router aggregation
│   │   ├── middleware/          # tRPC middleware
│   │   │   ├── auth.ts          # Authentication middleware
│   │   │   ├── cors.ts          # CORS configuration
│   │   │   └── logging.ts       # Request logging
│   │   ├── context.ts           # tRPC context creation
│   │   ├── server.ts            # Fastify server setup
│   │   └── app.ts               # Application entry point
│   └── types/                   # API-specific types
└── shared/                      # Shared tRPC definitions
    ├── routers/                 # Shared router types
    └── types/                   # Shared API types
```

## 🧩 **Component Architecture**

### **1. Atomic Design Pattern**

```typescript
components/
├── ui/                          # Atoms (shadcn/ui)
│   ├── button.tsx              # Basic button component
│   ├── input.tsx               # Form input component
│   ├── card.tsx                # Card container
│   └── avatar.tsx              # User avatar
├── forms/                       # Molecules
│   ├── LoginForm.tsx           # Login form component
│   ├── ArticleForm.tsx         # Article creation/edit
│   └── ProfileForm.tsx         # User profile form
├── features/                    # Organisms
│   ├── ArticleList.tsx         # Article listing
│   ├── CommentSection.tsx      # Comments component
│   └── UserProfile.tsx         # User profile display
└── layout/                      # Templates
    ├── Header.tsx              # Site header
    ├── Footer.tsx              # Site footer
    ├── Sidebar.tsx             # Navigation sidebar
    └── AuthLayout.tsx          # Authentication layout
```

### **2. Component Patterns**

```typescript
// Server Component (default in App Router)
export default async function ArticlePage({ params }: { params: { id: string } }) {
  const article = await api.articles.getById.query({ id: params.id });
  return <ArticleDisplay article={article} />;
}

// Client Component (interactive)
'use client';
export function ArticleForm() {
  const createArticle = api.articles.create.useMutation();
  // Form logic here
}

// Shared Component (with proper typing)
interface ArticleCardProps {
  article: RouterOutputs['articles']['list'][0];
  onEdit?: (id: string) => void;
}
```

## 🔄 **State Management Strategy**

### **1. Zustand Store Structure**

```typescript
// lib/store.ts
interface AppState {
  // Authentication state
  user: User | null;
  isAuthenticated: boolean;
  
  // UI state
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  
  // Cache for optimistic updates
  articlesCache: Record<string, Article>;
  
  // Actions
  setUser: (user: User | null) => void;
  toggleTheme: () => void;
  updateArticleCache: (id: string, article: Article) => void;
}

const useAppStore = create<AppState>((set, get) => ({
  // State implementation
}));
```

### **2. State Integration Patterns**

```typescript
// Hook for authenticated state
export const useAuth = () => {
  const { user, isAuthenticated } = useAppStore();
  const { data: session } = useSession();
  
  return {
    user: user || session?.user,
    isAuthenticated: isAuthenticated || !!session,
  };
};

// Hook for optimistic updates
export const useOptimisticArticles = () => {
  const { articlesCache, updateArticleCache } = useAppStore();
  const { data: articles } = api.articles.list.useQuery();
  
  return {
    articles: { ...articles, ...articlesCache },
    updateCache: updateArticleCache,
  };
};
```

## 🛡️ **Authentication Architecture**

### **1. NextAuth.js Configuration**

```typescript
// lib/auth.ts
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        // Use existing @conduit/utils validation
        const result = validateUserLogin(credentials);
        if (!result.success) return null;
        
        // Authenticate with your API
        const user = await authenticateUser(result.data);
        return user;
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) token.id = user.id;
      return token;
    },
    session: ({ session, token }) => {
      session.user.id = token.id;
      return session;
    },
  },
};
```

### **2. Route Protection**

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token') || 
                request.cookies.get('next-auth.session-token')?.value;
                
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
```

## 🔌 **tRPC Integration**

### **1. Server Setup (Fastify)**

```typescript
// apps/api/src/server.ts
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { appRouter } from './routers';

const server = fastify();

await server.register(fastifyTRPCPlugin, {
  prefix: '/trpc',
  trpcOptions: {
    router: appRouter,
    createContext: ({ req, res }) => ({ req, res, user: req.user }),
  },
});
```

### **2. Client Setup (Next.js)**

```typescript
// lib/trpc.ts
import { createTRPCNext } from '@trpc/next';
import type { AppRouter } from '../../api/src/routers';

export const api = createTRPCNext<AppRouter>({
  config() {
    return {
      links: [
        httpBatchLink({
          url: process.env.NEXT_PUBLIC_API_URL + '/trpc',
          headers: async () => {
            const session = await getSession();
            return session ? { authorization: `Bearer ${session.accessToken}` } : {};
          },
        }),
      ],
    };
  },
  ssr: false, // Disable SSR for dynamic content
});
```

### **3. Router Definitions**

```typescript
// apps/api/src/routers/articles.ts
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { createArticleSchema, updateArticleSchema } from '@conduit/utils/validation';

export const articlesRouter = router({
  list: publicProcedure
    .input(getArticlesQuerySchema)
    .query(({ input }) => {
      // Use existing validation from Phase 1
      return getArticles(input);
    }),
    
  create: protectedProcedure
    .input(createArticleSchema)
    .mutation(({ input, ctx }) => {
      // Reuse validation schemas from @conduit/utils
      return createArticle(input, ctx.user.id);
    }),
});
```

## 🎨 **UI Component System**

### **1. shadcn/ui Integration**

```bash
# Setup commands
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input card form
```

### **2. Custom Component Patterns**

```typescript
// components/ui/data-table.tsx
interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  loading?: boolean;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({ data, columns, loading }: DataTableProps<T>) {
  // Table implementation with loading states
}

// Usage with tRPC
function ArticlesPage() {
  const { data: articles, isLoading } = api.articles.list.useQuery();
  
  return (
    <DataTable
      data={articles || []}
      columns={articleColumns}
      loading={isLoading}
    />
  );
}
```

## 📱 **Form Handling**

### **1. React Hook Form + Zod Integration**

```typescript
// components/forms/ArticleForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createArticleSchema } from '@conduit/utils/validation';

export function ArticleForm() {
  const form = useForm({
    resolver: zodResolver(createArticleSchema),
    defaultValues: {
      article: {
        title: '',
        description: '',
        body: '',
        tagList: [],
      },
    },
  });
  
  const createArticle = api.articles.create.useMutation({
    onSuccess: () => {
      toast.success('Article created successfully!');
      router.push('/dashboard/articles');
    },
  });
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(createArticle.mutate)}>
        {/* Form fields */}
      </form>
    </Form>
  );
}
```

## 🔄 **Development Workflow**

### **1. Development Commands**

```json
{
  "scripts": {
    "dev": "turbo run dev",
    "dev:web": "turbo run dev --filter=@conduit/web",
    "dev:api": "turbo run dev --filter=@conduit/api",
    "build": "turbo run build",
    "test": "turbo run test",
    "type-check": "turbo run type-check",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio"
  }
}
```

### **2. Hot Reload Setup**

```typescript
// turbo.json
{
  "pipeline": {
    "dev": {
      "cache": false,
      "persistent": true,
      "dependsOn": ["^build"]
    }
  }
}
```

## 📊 **Performance Optimization**

### **1. Next.js Optimizations**

- **Static Generation**: Use `generateStaticParams` for article pages
- **Image Optimization**: Next.js Image component for user avatars
- **Code Splitting**: Dynamic imports for heavy components
- **Caching**: SWR/React Query integration with tRPC

### **2. Bundle Analysis**

```bash
# Add to Next.js config
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});
```

## 🧪 **Testing Strategy**

### **1. Testing Layers**

- **Unit Tests**: Component testing with React Testing Library
- **Integration Tests**: tRPC router testing
- **E2E Tests**: Playwright for user workflows
- **Visual Tests**: Storybook for component documentation

### **2. Test Configuration**

```typescript
// jest.config.js (apps/web)
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/test-setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
```

## 🚀 **Deployment Strategy**

### **1. Vercel (Frontend)**

```bash
# vercel.json
{
  "builds": [
    { "src": "apps/web/package.json", "use": "@vercel/next" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "apps/api/$1" }
  ]
}
```

### **2. Railway/Render (API)**

```dockerfile
# Dockerfile (apps/api)
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 📈 **Success Metrics**

### **Phase 2 Completion Criteria**

- ✅ **Authentication Flow**: Login, register, protected routes
- ✅ **Article Management**: CRUD operations with real-time updates
- ✅ **User Interface**: Responsive design with dark/light mode
- ✅ **Type Safety**: 100% TypeScript coverage across API/UI
- ✅ **Performance**: <100ms API response times, <3s page loads
- ✅ **Testing**: >90% test coverage for critical paths

### **Timeline Estimate**

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| **2A: Setup** | 2-3 days | Next.js app, tRPC client, basic routing |
| **2B: API** | 3-4 days | tRPC server, authentication, CRUD routes |
| **2C: UI** | 4-5 days | Component library, forms, user flows |
| **2D: Polish** | 2-3 days | Testing, optimization, deployment |

**Total: ~2 weeks** for a production-ready frontend

---

## 🎯 **Next Steps**

1. **Review and approve** this architecture plan
2. **Set up development environment** (Node.js, databases)
3. **Begin Phase 2A** with Next.js application scaffolding
4. **Establish CI/CD pipeline** for automated testing and deployment

Ready to start building? 🚀 