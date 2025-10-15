import type { BoardColumn } from "../types/board";

export const mockBoard: BoardColumn[] = [
  {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    name: "Todo",
    color: "danger",
    cards: [
      {
        id: "f9e8d7c6-b5a4-3210-9876-543210fedcba",
        title: "Design login page",
        description:
          "Create a responsive login and registration form following the current style guide. Include validation messages and a password visibility toggle. Make sure it works well on both desktop and mobile.",
        priority: "HIGH",
      },
      {
        id: "12345678-90ab-cdef-1234-567890abcdef",
        title: "Set up API integration",
        description:
          "Integrate frontend with backend endpoints for user authentication and profile data. Handle error responses gracefully and show proper loading states. Use Axios for requests and interceptors for auth tokens.",
        priority: "LOW",
      },
      {
        id: "fedcba98-7654-3210-fedc-ba9876543210",
        title: "Write project README",
        description:
          "Add a detailed README file describing the project setup, environment variables, and how to contribute. Include screenshots of the main views and short usage instructions for developers.",
        priority: "MEDIUM",
      },
      {
        id: "fedcba98-7654-3210-fedc-ba9844443210",
        title: "Create UI color palette",
        description:
          "Define a set of consistent color variables for light and dark themes. Document each color’s purpose (e.g., primary actions, warnings, success). Update the SCSS theme file accordingly.",
        priority: "HIGH",
      },
    ],
  },
  {
    id: "98765432-10fe-dcba-9876-543210fedcba",
    name: "In progress",
    color: "warning",
    cards: [
      {
        id: "abcdef12-3456-7890-abcd-ef1234567890",
        title: "Implement drag & drop",
        description:
          "Use dnd-kit to allow users to drag cards between columns. Keep card order persistent after drop and animate transitions smoothly. Ensure the feature works on both mouse and touch devices.",
        priority: "MEDIUM",
      },
      {
        id: "567890ab-cdef-1234-5678-90abcdef1234",
        title: "Optimize dashboard layout",
        description:
          "Adjust column spacing and layout responsiveness for tablets and smaller screens. Improve vertical alignment of cards and headers. Verify it still looks clean on 4K resolutions.",
        priority: "HIGH",
      },
      {
        id: "bcdef123-4567-890a-bcde-f12345678901",
        title: "Add loading spinner",
        description:
          "Show a spinner while fetching data from the API. Replace it with a fade-in animation once the content loads. Consider adding skeleton loaders for better UX.",
        priority: "LOW",
      },
      {
        id: "cdef1234-5678-90ab-cdef-123456789012",
        title: "Test authentication flow",
        description:
          "Manually verify login, logout, and token refresh. Add Cypress tests to cover login edge cases and API failures. Confirm the user stays logged in after a page reload.",
        priority: "HIGH",
      },
    ],
  },
  {
    id: "def12345-6789-0abc-def1-234567890123",
    name: "Done",
    color: "success",
    cards: [
      {
        id: "ef123456-7890-abcd-ef12-345678901234",
        title: "Set up project structure",
        description:
          "Organized the project into modules for components, hooks, mocks, and services. Added basic routing and global styling files. The structure now supports scalability and clean imports.",
        priority: "HIGH",
      },
      {
        id: "01234567-89ab-cdef-0123-456789abcdef",
        title: "Install dependencies",
        description:
          "Installed core libraries like React, Bootstrap, and dnd-kit. Added TypeScript and ESLint for better type safety and code quality. Configured Prettier for consistent formatting.",
        priority: "LOW",
      },
      {
        id: "ef123456-7890-abcd-ef12-345671111234",
        title: "Configure ESLint and Prettier",
        description:
          "Set up a shared config for linting and code formatting. Added pre-commit hooks with Husky to enforce clean code. Verified rules across different environments.",
        priority: "HIGH",
      },
    ],
  },
];
