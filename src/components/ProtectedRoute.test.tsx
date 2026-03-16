import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../contexts/AuthContext";
import type { User } from "@supabase/supabase-js";

jest.mock("../contexts/AuthContext");

const mockedUseAuth = jest.mocked(useAuth);

describe("ProtectedRoute", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading container while auth is loading", () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      loading: true,
      logout: jest.fn(),
    });

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <div>Private</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.queryByText("Private")).not.toBeInTheDocument();
  });

  it("renders children when user is authenticated", () => {
    mockedUseAuth.mockReturnValue({
      user: { id: "u1" } as unknown as User,
      loading: false,
      logout: jest.fn(),
    });

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <div>Private</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Private")).toBeInTheDocument();
  });

  it("redirects to /login when user is not authenticated", () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      loading: false,
      logout: jest.fn(),
    });

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <div>Private</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Login")).toBeInTheDocument();
  });
});

