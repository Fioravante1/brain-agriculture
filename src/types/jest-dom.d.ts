/// <reference types="jest" />
/// <reference types="@testing-library/jest-dom" />

declare namespace jest {
  interface Matchers<R> {
    toBeInTheDocument(): R;
    toHaveAttribute(attribute: string, value?: string): R;
    toContainElement(element: HTMLElement | null): R;
    toHaveTextContent(text: string | RegExp): R;
  }
}
