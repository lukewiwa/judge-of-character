# CLAUDE.md — Judge of Character

## Project Overview

**Judge of Character** is a Progressive Web App (PWA) handwriting recognition game. Users draw randomly generated letters on a canvas, and the app uses Tesseract.js OCR to recognize what was drawn. Players earn points for correct letters, with difficulty increasing each level (more characters required). Players have 5 attempts before game over.

**Live site:** [judgeofcharacter.xyz](https://judgeofcharacter.xyz)

## Repository Structure

```
judge-of-character/
├── src/                    # React frontend application (Vite + TypeScript)
│   ├── App.tsx             # Root component, wraps Game with context providers
│   ├── main.tsx            # React entry point
│   ├── components/
│   │   ├── Game.tsx              # Main game UI (level, points, attempts, pass/fail)
│   │   ├── ScribblePad.tsx       # Canvas wrapper around signature_pad library
│   │   └── JudgedScribblePad.tsx # Combines ScribblePad with OCR recognition
│   ├── hooks/
│   │   ├── GameState.tsx   # Game state context (level, points, attempts, actions)
│   │   └── Ocr.tsx         # Tesseract.js OCR worker context
│   ├── constants.ts        # Shared constants (allowable characters A-Z)
│   ├── index.css           # Tailwind CSS import only
│   ├── public/             # Static assets (favicons, manifest, icons)
│   ├── vite.config.ts      # Vite config with React Compiler + Tailwind plugin
│   ├── eslint.config.js    # ESLint flat config
│   ├── tsconfig.json       # TypeScript project references
│   ├── tsconfig.app.json   # App TS config (ES2022, strict, React JSX)
│   └── package.json
├── infra/                  # AWS CDK infrastructure
│   ├── bin/infra.ts        # CDK app entry point (CertificateStack + InfraStack)
│   ├── lib/
│   │   ├── certificate-stack.ts  # ACM certificate (us-east-1) with DNS validation
│   │   ├── infra-stack.ts        # S3 + CloudFront + Route53 + S3 deployment
│   │   └── settings.ts           # Reads FULLY_QUALIFIED_DOMAIN env var
│   ├── test/infra.test.ts  # Jest test file (stub)
│   ├── cdk.json            # CDK config with feature flags
│   ├── jest.config.js      # Jest config for infra tests
│   ├── tsconfig.json       # Infra TS config (ES2022, NodeNext)
│   └── package.json
├── .github/workflows/
│   ├── build.yaml          # CI: lint + build on push (non-master)
│   └── deploy.yml          # CD: manual deploy to AWS
├── .devcontainer/          # Dev container config (Node 22, Docker, AWS CLI)
├── makefile                # Deploy shortcut
└── .gitignore
```

## Development Commands

All frontend commands run from the `src/` directory:

```bash
# Install dependencies
npm --prefix=src ci

# Start dev server with HMR
npm --prefix=src run dev

# Lint
npm --prefix=src run lint

# Build (TypeScript compile + Vite bundle)
npm --prefix=src run build

# Preview production build
npm --prefix=src run preview
```

Infrastructure commands run from the `infra/` directory:

```bash
# Install dependencies
npm --prefix=infra ci

# Run tests
npm --prefix=infra run test

# Build TypeScript
npm --prefix=infra run build

# Deploy (requires AWS credentials + FULLY_QUALIFIED_DOMAIN env var)
make deploy
```

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| UI Framework | React | 19 |
| Build Tool | Vite (rolldown-vite) | 7.x |
| Language | TypeScript | 5.8 (src), 5.6 (infra) |
| Styling | Tailwind CSS | 4.x |
| Canvas Drawing | signature_pad | 5.x |
| OCR | tesseract.js | 6.x |
| Infrastructure | AWS CDK | 2.x |
| Runtime | Node.js | 22 |
| Optimization | React Compiler | babel-plugin |

## Architecture & Key Patterns

### State Management

State is managed via React Context (no external state library):

- **GameState context** (`src/hooks/GameState.tsx`): Uses `useReducer` with actions `RESET`, `PASS`, `FAIL`. Tracks `level`, `points`, `attempts`, and `requiredText`. Points awarded = level × remaining attempts. Each level adds one more character to draw.
- **OCR context** (`src/hooks/Ocr.tsx`): Manages Tesseract.js worker lifecycle. Initializes worker on mount with character whitelist (A-Z only). Exposes `recognizeText(imageData)` function.

### Component Hierarchy

```
App
└── GameStateContextProvider
    └── OcrContextProvider
        └── Game
            └── JudgedScribblePad
                └── ScribblePad (canvas + signature_pad)
```

### OCR Flow

1. User draws on `ScribblePad` canvas
2. `JudgedScribblePad` debounces end-of-stroke (800ms)
3. Canvas exported to data URL → sent to Tesseract worker
4. Recognized text compared to `requiredText` in `Game`
5. Match → PASS action; mismatch → FAIL action
6. Canvas auto-clears after recognition

### Infrastructure (AWS)

Two CDK stacks deployed:

1. **CertificateStack** (us-east-1): ACM certificate for CloudFront (must be in us-east-1)
2. **InfraStack** (ap-southeast-2): S3 bucket (private, OAC) → CloudFront distribution → Route53 A record

The `FULLY_QUALIFIED_DOMAIN` environment variable (set to `judgeofcharacter.xyz`) is required for deployment.

## CI/CD

- **build.yaml**: Runs on push to non-master branches. Installs deps, lints, and builds the frontend (`src/`).
- **deploy.yml**: Manual trigger (`workflow_dispatch`). Builds frontend, then runs `make deploy` (CDK deploy) with AWS credentials from GitHub secrets.

## Code Conventions

- **ES Modules**: The project uses `"type": "module"` throughout
- **Strict TypeScript**: Both `src` and `infra` use strict mode with no unused locals/parameters
- **Functional React**: All components are functional with hooks — no class components
- **Tailwind CSS only**: No custom CSS beyond Tailwind utilities; styles applied via className
- **Flat ESLint config**: Uses the modern flat config format (`eslint.config.js`)
- **React Compiler**: Enabled via babel plugin in Vite config for automatic memoization
- **No test framework for frontend**: Only infrastructure has Jest configured
- **Context for shared state**: Use React Context + useReducer pattern, not prop drilling or external libraries

## Environment Variables

| Variable | Required For | Value |
|----------|-------------|-------|
| `FULLY_QUALIFIED_DOMAIN` | CDK deploy | `judgeofcharacter.xyz` |
| `AWS_ACCESS_KEY_ID` | CDK deploy | GitHub secret |
| `AWS_SECRET_ACCESS_KEY` | CDK deploy | GitHub secret |
| `AWS_DEFAULT_REGION` | CDK deploy | `ap-southeast-2` |

Local development needs no environment variables. A `.env` file (gitignored) is loaded by the devcontainer.

## Common Tasks

### Adding a new component

1. Create the component in `src/components/`
2. Use functional component with TypeScript
3. Style with Tailwind CSS classes
4. Import and use in the component hierarchy

### Modifying game logic

Game rules live in `src/hooks/GameState.tsx` — the reducer handles all state transitions. Modify the `PASS`/`FAIL` cases or add new action types as needed.

### Modifying OCR behavior

OCR configuration is in `src/hooks/Ocr.tsx`. The character whitelist and Tesseract worker settings are set during initialization.

### Infrastructure changes

Modify stacks in `infra/lib/`. Run `npm --prefix=infra run build` to compile, then `make deploy` to apply.
