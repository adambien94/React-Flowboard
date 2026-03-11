import "@testing-library/jest-dom";

// Polyfill TextEncoder required by react-router in Jest / jsdom
// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (!(global as any).TextEncoder) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { TextEncoder } = require("util");
  (global as any).TextEncoder = TextEncoder;
}

// Polyfill matchMedia used by react-bootstrap Offcanvas
// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (!(window as any).matchMedia) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

