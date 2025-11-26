import type { Board } from "../types/board";

export const mockBoards: Board[] = [
  {
    id: "team-sprint",
    name: "Team Sprint",
    columns: [
      {
        id: "col-backlog",
        name: "Backlog",
        color: "info",
        cards: [
          {
            id: "task-backlog-1",
            title: "Collect sprint requirements",
            description:
              "Meet with stakeholders to confirm sprint goals, scope, and success metrics. Document any risks or dependencies that surfaced.",
            priority: "MEDIUM",
          },
          {
            id: "task-backlog-2",
            title: "Prepare QA test plan",
            description:
              "Outline test cases for the new automation features, including performance benchmarks and regression scenarios.",
            priority: "LOW",
          },
        ],
      },
      {
        id: "col-doing",
        name: "In Progress",
        color: "primary",
        cards: [
          {
            id: "task-progress-1",
            title: "Build notifications hub",
            description:
              "Implement server-sent events to dispatch workspace notifications in real time and persist user preferences.",
            priority: "HIGH",
          },
          {
            id: "task-progress-2",
            title: "Refactor auth middleware",
            description:
              "Split the monolithic middleware into smaller pieces for logging, token validation, and role enforcement.",
            priority: "MEDIUM",
          },
        ],
      },
      {
        id: "col-review",
        name: "Review",
        color: "secondary",
        cards: [
          {
            id: "task-review-1",
            title: "Accessibility audit",
            description:
              "Verify keyboard navigation paths, add missing ARIA labels, and run axe-core to capture outstanding issues.",
            priority: "HIGH",
          },
        ],
      },
      {
        id: "col-done-team",
        name: "Done",
        color: "success",
        cards: [
          {
            id: "task-done-1",
            title: "Deploy infra updates",
            description:
              "Rolled out Terraform changes to add staging environment autoscaling and tightened security groups.",
            priority: "MEDIUM",
          },
          {
            id: "task-done-2",
            title: "Ship analytics dashboard",
            description:
              "Delivered the first version of the exec dashboard with cohort charts, revenue projections, and exports.",
            priority: "HIGH",
          },
        ],
      },
    ],
  },
  {
    id: "personal",
    name: "Personal Tasks",
    columns: [
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
        ],
      },
    ],
  },
];
