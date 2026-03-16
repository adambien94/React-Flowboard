import "@testing-library/jest-dom";
import { TextEncoder as NodeTextEncoder } from "util";

// Polyfill TextEncoder required by react-router in Jest / jsdom
const globalWithEncoder = globalThis as typeof globalThis & {
  TextEncoder?: typeof NodeTextEncoder;
};

if (!globalWithEncoder.TextEncoder) {
  globalWithEncoder.TextEncoder = NodeTextEncoder;
}

// Polyfill matchMedia used by react-bootstrap Offcanvas
const windowWithMatchMedia = window as typeof window & {
  matchMedia?: (query: string) => MediaQueryList;
};

if (!windowWithMatchMedia.matchMedia) {
  windowWithMatchMedia.matchMedia = (query: string): MediaQueryList => ({
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

