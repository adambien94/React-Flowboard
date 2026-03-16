import "@testing-library/jest-dom";
import { TextDecoder, TextEncoder } from "util";

// Polyfills required by react-router in Jest / jsdom.
// Node's util types differ slightly from the DOM lib types, so we cast here.
if (!globalThis.TextEncoder) {
  globalThis.TextEncoder = TextEncoder as unknown as typeof globalThis.TextEncoder;
}
if (!globalThis.TextDecoder) {
  globalThis.TextDecoder = TextDecoder as unknown as typeof globalThis.TextDecoder;
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

