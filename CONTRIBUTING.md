# Contributing to FHEVM Universal SDK

Thank you for your interest in contributing to the FHEVM Universal SDK! This document provides guidelines and instructions for contributing.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [Contribution Workflow](#contribution-workflow)
5. [Coding Standards](#coding-standards)
6. [Testing Requirements](#testing-requirements)
7. [Documentation](#documentation)
8. [Pull Request Process](#pull-request-process)
9. [Issue Reporting](#issue-reporting)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors. We expect everyone to:

- Be respectful and considerate
- Use welcoming and inclusive language
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment or discrimination of any kind
- Trolling, insulting comments, or personal attacks
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

---

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Git** for version control
- A **GitHub account**
- Basic understanding of TypeScript, React, or Vue
- Familiarity with Ethereum and smart contracts (for contract contributions)

### Areas to Contribute

We welcome contributions in the following areas:

1. **SDK Core** - Framework-agnostic functionality
2. **Framework Integration** - React, Vue, Angular, Svelte support
3. **Documentation** - Guides, tutorials, API references
4. **Examples** - Sample applications and use cases
5. **Testing** - Unit tests, integration tests, E2E tests
6. **Bug Fixes** - Issue resolution and improvements
7. **Performance** - Optimization and efficiency improvements

---

## Development Setup

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork

git clone https://github.com/YOUR_USERNAME/fhevm-react-template.git
cd fhevm-react-template
```

### 2. Install Dependencies

```bash
# Install all dependencies (root + packages + examples)
npm run install:all
```

### 3. Build the SDK

```bash
# Build the SDK package
npm run build:sdk
```

### 4. Run Tests

```bash
# Run all tests
npm run test:all

# Or test specific parts
cd packages/fhevm-sdk && npm test
cd examples/renewable-energy-market && npm test
```

### 5. Start Development

```bash
# For SDK development
cd packages/fhevm-sdk
npm run dev

# For Next.js example
cd examples/nextjs-energy-market
npm run dev

# For contract development
cd examples/renewable-energy-market
npm run compile
```

---

## Contribution Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

**Branch Naming Conventions:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `test/` - Test additions or fixes
- `refactor/` - Code refactoring
- `perf/` - Performance improvements

### 2. Make Your Changes

- Write clean, readable code
- Follow the coding standards (see below)
- Add tests for new functionality
- Update documentation as needed
- Keep commits atomic and focused

### 3. Commit Your Changes

Use clear, descriptive commit messages:

```bash
git add .
git commit -m "Add feature: description of what you added"
```

**Commit Message Format:**
```
<type>: <subject>

<body>

<footer>
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation only
- `style:` - Formatting, missing semi-colons, etc.
- `refactor:` - Code change that neither fixes a bug nor adds a feature
- `test:` - Adding missing tests
- `chore:` - Maintain tasks

**Example:**
```
feat: add Vue 3 composables for FHEVM operations

- Implement useFhevm composable
- Add useEncrypt and useDecrypt
- Include comprehensive JSDoc comments
- Add unit tests with 90% coverage

Closes #123
```

### 4. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 5. Create Pull Request

Go to GitHub and create a Pull Request from your branch to our `main` branch.

---

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Provide comprehensive type definitions
- Avoid `any` types unless absolutely necessary
- Use interfaces for object shapes
- Document complex types with JSDoc

**Example:**
```typescript
/**
 * Configuration for FHEVM client initialization
 */
export interface FhevmClientConfig {
  /** Network name: 'sepolia' | 'mainnet' | 'localhost' */
  network: NetworkName;

  /** Contract address to interact with */
  contractAddress: string;

  /** Optional custom RPC URL */
  rpcUrl?: string;
}
```

### Code Style

- **Indentation**: 2 spaces
- **Line Length**: Maximum 100 characters
- **Quotes**: Single quotes for strings
- **Semicolons**: Required
- **Trailing Commas**: Use for multi-line objects/arrays

### File Naming

- Use **kebab-case** for files: `my-component.tsx`
- Use **PascalCase** for React components: `MyComponent.tsx`
- Use **camelCase** for utilities: `myUtility.ts`

### Code Organization

```typescript
// 1. Imports
import { useState } from 'react';
import type { FhevmClient } from './types';

// 2. Types/Interfaces
interface MyComponentProps {
  client: FhevmClient;
}

// 3. Constants
const DEFAULT_VALUE = 100;

// 4. Component/Function
export function MyComponent({ client }: MyComponentProps) {
  // Implementation
}
```

### Comments and Documentation

- Add JSDoc comments for all exported functions, classes, and interfaces
- Explain **why**, not **what** (code should be self-explanatory)
- Keep comments up-to-date with code changes

**Example:**
```typescript
/**
 * Encrypts a value using FHEVM
 *
 * @param client - Initialized FHEVM client
 * @param value - Value to encrypt (number, bigint, or boolean)
 * @param options - Encryption options (bit size, security zone)
 * @returns Encrypted value as Uint8Array
 *
 * @example
 * ```typescript
 * const encrypted = await encrypt(client, 1000, { bits: 32 });
 * ```
 */
export async function encrypt(
  client: FhevmClient,
  value: number | bigint | boolean,
  options?: EncryptOptions
): Promise<EncryptedValue> {
  // Implementation
}
```

---

## Testing Requirements

### Test Coverage

- **Minimum Coverage**: 80% for new code
- **Target Coverage**: 90%+ for critical paths
- All new features must include tests
- Bug fixes should include regression tests

### Testing Tools

- **Unit Tests**: Jest
- **React Testing**: React Testing Library
- **Smart Contracts**: Hardhat + Mocha + Chai
- **E2E Tests**: Playwright (for full applications)

### Writing Tests

```typescript
import { encrypt } from './encryption';
import { createFhevmClient } from './client';

describe('encrypt', () => {
  let client: FhevmClient;

  beforeEach(async () => {
    client = await createFhevmClient({
      network: 'localhost',
      contractAddress: '0x...'
    });
  });

  it('should encrypt 32-bit values correctly', async () => {
    const value = 1000;
    const encrypted = await encrypt(client, value, { bits: 32 });

    expect(encrypted).toBeInstanceOf(Uint8Array);
    expect(encrypted.length).toBeGreaterThan(0);
  });

  it('should throw error for invalid bit size', async () => {
    await expect(
      encrypt(client, 1000, { bits: 7 as any })
    ).rejects.toThrow('Unsupported bit size');
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run specific test file
npm test -- encryption.test.ts
```

---

## Documentation

### Documentation Requirements

All contributions should include appropriate documentation:

1. **Code Comments**: JSDoc for public APIs
2. **README Updates**: For new features or changes
3. **Examples**: Code snippets showing usage
4. **API Reference**: Update if adding/changing public APIs

### Writing Documentation

- Use clear, concise language
- Provide code examples
- Include common use cases
- Document edge cases and limitations
- Keep formatting consistent

### Documentation Structure

```markdown
## Feature Name

Brief description of what the feature does.

### Usage

\`\`\`typescript
// Example code
\`\`\`

### Parameters

- `param1` - Description
- `param2` - Description

### Returns

Description of return value

### Example

\`\`\`typescript
// Complete example
\`\`\`

### Notes

- Important note 1
- Important note 2
```

---

## Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] New tests added for new functionality
- [ ] Documentation updated
- [ ] No console.log or debugging code
- [ ] Branch is up-to-date with main
- [ ] Commit messages are clear and descriptive

### PR Template

When creating a PR, include:

**Description:**
Clear description of what the PR does

**Type of Change:**
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

**Related Issues:**
Closes #issue_number

**Testing:**
Describe how you tested the changes

**Screenshots:**
If applicable, add screenshots

**Checklist:**
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing tests pass locally

### Review Process

1. **Automated Checks**: CI/CD will run tests and linting
2. **Code Review**: Maintainers will review your code
3. **Feedback**: Address any requested changes
4. **Approval**: Once approved, your PR will be merged

### After Merge

- Your contribution will be credited in release notes
- Delete your feature branch
- Pull the latest changes from main

---

## Issue Reporting

### Before Creating an Issue

- Search existing issues to avoid duplicates
- Gather relevant information (error messages, versions, etc.)
- Try to reproduce the issue
- Check if it's a known limitation

### Creating an Issue

**Bug Report Template:**

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- SDK Version:
- Framework:
- Node.js Version:
- OS:

## Additional Context
Any other relevant information
```

**Feature Request Template:**

```markdown
## Feature Description
Clear description of the feature

## Use Case
Why this feature is needed

## Proposed Solution
How you think it should work

## Alternatives Considered
Other approaches you've thought about

## Additional Context
Any other relevant information
```

---

## Getting Help

If you need help:

1. **Documentation**: Check README and other docs
2. **Examples**: Review example applications
3. **Issues**: Search existing issues
4. **Discussions**: Start a GitHub Discussion
5. **Community**: Join the Zama community

---

## Recognition

Contributors will be recognized in:

- Release notes
- CONTRIBUTORS.md file
- Project documentation
- GitHub contributor graph

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## Questions?

If you have questions about contributing, please:

- Open a GitHub Discussion
- Comment on relevant issues
- Reach out to maintainers

---

**Thank you for contributing to FHEVM Universal SDK!**

Together, we're building the future of privacy-preserving dApps.
