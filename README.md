# reddit-auto

Next.js frontend for Reddit account automation. Provides a clean UI for managing Reddit accounts and executing browser-based actions through the reddit-auto-api backend.

## Features

- **Account Management**: Add, edit, and delete Reddit accounts
- **Proxy Support**: Configure SOCKS5 proxies per account
- **Action Execution**: Trigger login, register, and reply actions
- **Action History**: View logs of all executed actions
- **Modern UI**: Clean, responsive interface built with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **State Management**: React hooks

## Prerequisites

- Node.js 20+
- reddit-auto-api backend running

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Environment variables:
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: `http://localhost:3000`)

### 3. Start the development server

```bash
npm run dev
```

The app will be available at [http://localhost:3001](http://localhost:3001).

## Project Structure

```
src/
├── app/                    # App Router pages
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Dashboard
│   └── accounts/
│       ├── page.tsx        # Account list
│       ├── new/page.tsx    # Add account
│       └── [id]/
│           ├── page.tsx    # Account detail
│           └── edit/page.tsx
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── Badge.tsx
│   ├── accounts/           # Account components
│   │   ├── AccountList.tsx
│   │   ├── AccountForm.tsx
│   │   └── AccountActions.tsx
│   └── layout/             # Layout components
│       ├── Sidebar.tsx
│       └── Header.tsx
├── lib/
│   ├── api.ts              # API client
│   └── types.ts            # Shared types
└── hooks/
    ├── useAccounts.ts      # Accounts hook
    └── useAccount.ts       # Single account hook
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Dashboard with quick links |
| `/accounts` | List all accounts |
| `/accounts/new` | Add new account |
| `/accounts/[id]` | Account details and actions |
| `/accounts/[id]/edit` | Edit account |

## Development

### Linting

```bash
npm run lint
```

### Type checking

```bash
npm run build
```

### Running with backend

1. Start the backend (reddit-auto-api) on port 3000
2. Start this frontend on port 3001: `npm run dev -- -p 3001`

## API Integration

The frontend communicates with reddit-auto-api backend. Make sure the backend is running and the `NEXT_PUBLIC_API_URL` environment variable is correctly set.

## License

MIT
