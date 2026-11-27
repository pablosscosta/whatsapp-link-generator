import '@testing-library/jest-dom/vitest';

// jsdom does not implement scrolling; tests that need it spy on this no-op.
Element.prototype.scrollIntoView = () => undefined;

afterEach(() => {
  vi.restoreAllMocks();
});
