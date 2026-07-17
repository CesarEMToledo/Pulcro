# Testing

100% test coverage is the key to great vibe coding. Tests let you move fast, trust your
instincts, and ship with confidence — without them, vibe coding is just yolo coding.
With tests, it's a superpower.

## Framework

[jest-expo](https://docs.expo.dev/develop/unit-testing/) (Expo's official Jest preset)
with [@testing-library/react-native](https://callstack.github.io/react-native-testing-library/)
for hooks and component testing.

## Running tests

```bash
npm test
```

## Test layers

- **Unit tests** — pure logic, hooks, context reducers. Live in `__tests__/` at the repo
  root, named `<Subject>.test.tsx`. Example: `__tests__/CartContext.test.tsx`.
- **Regression tests** — added by `/qa` when it fixes a bug. Named
  `<name>.regression-N.test.tsx`, with a comment linking back to the QA report.

## Conventions

- File naming: `__tests__/<Subject>.test.tsx`.
- Use `renderHook`/`act` from `@testing-library/react-native` for context/hook tests —
  both are **async** in this version of the library, so always `await` them.
- `@react-native-async-storage/async-storage` is mocked via `jest.setup.js`
  (`@react-native-async-storage/async-storage/jest/async-storage-mock`). Call
  `await AsyncStorage.clear()` in `beforeEach` for any test touching storage-backed state
  — the mock's internal store is a shared singleton across tests.
- Assert real behavior (state shape, computed values), never `toBeDefined()`/`not.toThrow()`
  as the only assertion.
