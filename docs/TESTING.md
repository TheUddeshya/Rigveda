# Testing Guide - Rigveda Explorer

**Last Updated**: 2025-11-02
**Test Framework**: Vitest + React Testing Library
**Current Coverage**: 124 tests across 6 test files

## Table of Contents

1. [Overview](#overview)
2. [Running Tests](#running-tests)
3. [Test Structure](#test-structure)
4. [Writing Tests](#writing-tests)
5. [Test Patterns](#test-patterns)
6. [Troubleshooting](#troubleshooting)

---

## Overview

The Rigveda Explorer uses a comprehensive testing strategy with:

- **Unit Tests**: Testing individual utilities and functions
- **Component Tests**: Testing React components in isolation
- **Integration Tests**: Testing component interactions

### Current Test Statistics

| Category | Files | Tests | Status |
|----------|-------|-------|--------|
| Unit Tests | 2 | 60 | ✅ Passing |
| Component Tests | 3 | 62 | ✅ Passing |
| Integration Tests | 1 | 2 | ✅ Passing |
| **Total** | **6** | **124** | **✅ All Passing** |

### Test Performance

- **Test Duration**: ~1.6 seconds
- **Test Speed**: Excellent (optimized with proper mocking)
- **Memory Usage**: Stable (8GB max configured)

---

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (during development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npx vitest run test/unit/searchEngine.test.ts

# Run tests matching a pattern
npx vitest run --reporter=verbose
```

### CI/CD Integration

Tests are configured to run in CI/CD with:
- Single worker process (prevents memory issues)
- Fork pool strategy (better isolation)
- Automatic cleanup between tests

---

## Test Structure

### Directory Organization

```
test/
├── components/          # Component tests
│   ├── FilterPanel.test.tsx
│   ├── VerseCard.test.tsx
│   └── Sidebar.test.tsx
├── unit/               # Unit tests
│   ├── animations.test.ts
│   └── searchEngine.test.ts
├── integration/        # Integration tests (future)
│   └── verseLoader.test.ts
└── setup.ts           # Global test setup
```

### Test File Naming

- Unit tests: `*.test.ts`
- Component tests: `*.test.tsx`
- Integration tests: `*.test.ts` or `*.test.tsx`

---

## Writing Tests

### Basic Test Template

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('ComponentName', () => {
  beforeEach(() => {
    // Setup code runs before each test
    vi.clearAllMocks();
  });

  describe('Feature Group', () => {
    it('describes what it should do', () => {
      // Arrange
      const mockData = { /* ... */ };

      // Act
      render(<ComponentName data={mockData} />);

      // Assert
      expect(screen.getByText('Expected Text')).toBeInTheDocument();
    });
  });
});
```

### Component Test Example

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from '../../src/components/MyComponent';

describe('MyComponent', () => {
  it('handles user interactions', async () => {
    const user = userEvent.setup();
    const mockHandler = vi.fn();

    render(<MyComponent onClick={mockHandler} />);

    const button = screen.getByRole('button', { name: 'Click me' });
    await user.click(button);

    expect(mockHandler).toHaveBeenCalledTimes(1);
  });
});
```

### Unit Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { myUtilityFunction } from '../../src/utils/myUtil';

describe('myUtilityFunction', () => {
  it('returns expected result for valid input', () => {
    const result = myUtilityFunction('input');
    expect(result).toBe('expected output');
  });

  it('handles edge cases', () => {
    expect(myUtilityFunction('')).toBe('');
    expect(myUtilityFunction(null)).toBeUndefined();
  });
});
```

---

## Test Patterns

### 1. Mocking Dependencies

#### Mock External Modules

```typescript
vi.mock('../../src/utils/verseLoader', () => ({
  loadMandala: vi.fn(() => Promise.resolve([])),
}));
```

#### Mock Hooks

```typescript
vi.mock('../../src/hooks/useBookmarks', () => ({
  useBookmarks: () => ({
    isBookmarked: vi.fn(() => false),
    toggleBookmark: vi.fn(),
  }),
}));
```

### 2. Testing Async Code

```typescript
it('loads data asynchronously', async () => {
  render(<AsyncComponent />);

  // Wait for element to appear
  await waitFor(() => {
    expect(screen.getByText('Loaded Data')).toBeInTheDocument();
  });
});
```

### 3. Testing User Interactions

```typescript
it('handles user input', async () => {
  const user = userEvent.setup();
  render(<SearchComponent />);

  const input = screen.getByPlaceholderText('Search...');
  await user.type(input, 'test query');

  expect(input).toHaveValue('test query');
});
```

### 4. Testing Accessibility

```typescript
it('has proper ARIA labels', () => {
  render(<Component />);

  expect(screen.getByLabelText('Search')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
});
```

### 5. Testing Edge Cases

```typescript
describe('Edge Cases', () => {
  it('handles empty data', () => {
    render(<Component data={[]} />);
    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  it('handles null values', () => {
    render(<Component data={null} />);
    expect(screen.queryByText('Error')).not.toBeInTheDocument();
  });
});
```

---

## Test Coverage Goals

### Current Coverage

- **Unit Tests**: ~80% of utilities covered
- **Component Tests**: Major components covered
- **Integration Tests**: Basic flows covered

### Target Coverage

- **Overall**: 80%+ code coverage
- **Critical Paths**: 100% coverage for:
  - Search functionality
  - Verse display
  - Filter operations
  - Navigation

### Coverage Report

```bash
# Generate coverage report
npm run test:coverage

# View HTML coverage report
open coverage/index.html
```

---

## Best Practices

### DO:

✅ Write descriptive test names
✅ Test user behavior, not implementation
✅ Use `screen` queries for better maintainability
✅ Mock external dependencies
✅ Test accessibility
✅ Clean up after tests (automatic with setup)
✅ Group related tests with `describe`
✅ Test edge cases and error states

### DON'T:

❌ Test implementation details
❌ Write brittle tests tied to specific DOM structure
❌ Skip error case testing
❌ Use `setTimeout` for async tests (use `waitFor`)
❌ Forget to clear mocks between tests
❌ Test external libraries (trust they work)

---

## Common Testing Patterns

### Testing Forms

```typescript
it('submits form with valid data', async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();

  render(<Form onSubmit={onSubmit} />);

  await user.type(screen.getByLabelText('Name'), 'John Doe');
  await user.click(screen.getByRole('button', { name: 'Submit' }));

  expect(onSubmit).toHaveBeenCalledWith({ name: 'John Doe' });
});
```

### Testing Lists

```typescript
it('renders all items', () => {
  const items = ['Item 1', 'Item 2', 'Item 3'];
  render(<List items={items} />);

  items.forEach(item => {
    expect(screen.getByText(item)).toBeInTheDocument();
  });
});
```

### Testing Conditional Rendering

```typescript
it('shows content when condition is true', () => {
  render(<ConditionalComponent show={true} />);
  expect(screen.getByText('Content')).toBeInTheDocument();
});

it('hides content when condition is false', () => {
  render(<ConditionalComponent show={false} />);
  expect(screen.queryByText('Content')).not.toBeInTheDocument();
});
```

---

## Troubleshooting

### Common Issues

#### Issue: Tests timeout

**Solution**: Increase timeout or check for unresolved promises

```typescript
it('async test', async () => {
  // Make sure all async operations are awaited
  await waitFor(() => {
    expect(screen.getByText('Done')).toBeInTheDocument();
  }, { timeout: 5000 });
});
```

#### Issue: "Found multiple elements"

**Solution**: Use more specific queries

```typescript
// ❌ Too generic
screen.getByText('Submit')

// ✅ More specific
screen.getByRole('button', { name: 'Submit Form' })
```

#### Issue: Memory leaks

**Solution**: Already handled by automatic cleanup in `test/setup.ts`

#### Issue: "window.scrollTo not implemented"

**Solution**: This is a harmless warning from jsdom. Can be suppressed if needed.

---

## Advanced Topics

### Testing Custom Hooks

```typescript
import { renderHook, act } from '@testing-library/react';

it('custom hook works correctly', () => {
  const { result } = renderHook(() => useCustomHook());

  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(1);
});
```

### Testing with React Query

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

it('fetches data', async () => {
  render(<Component />, { wrapper: createWrapper() });

  await waitFor(() => {
    expect(screen.getByText('Data loaded')).toBeInTheDocument();
  });
});
```

### Snapshot Testing (Use Sparingly)

```typescript
it('matches snapshot', () => {
  const { container } = render(<Component />);
  expect(container).toMatchSnapshot();
});
```

---

## Resources

- [Vitest Documentation](https://vitest.dev)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Accessibility Testing](https://www.w3.org/WAI/test-evaluate/)

---

## Contributing

When adding new features:

1. Write tests first (TDD approach recommended)
2. Ensure all tests pass: `npm test`
3. Check test coverage: `npm run test:coverage`
4. Update this documentation if adding new patterns

---

**Maintained By**: Development Team
**Review Frequency**: After major feature additions
