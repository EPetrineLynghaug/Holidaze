/**
 * @jest-environment jsdom
 */

// useAuthUser.test.js
import React from "react";
import { render, screen, act } from "@testing-library/react";
import useAuthUser from "../hooks/useAuthUser";

// A simple component to expose hook value
function TestComponent() {
  const user = useAuthUser();
  return (
    <div data-testid="user-value">{user ? JSON.stringify(user) : "null"}</div>
  );
}

describe("useAuthUser hook via TestComponent", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders null when no user is stored", () => {
    render(<TestComponent />);
    const display = screen.getByTestId("user-value");
    expect(display.textContent).toBe("null");
  });

  it("reads initial user from localStorage", () => {
    const userObj = { name: "Alice", avatar: { url: "/alice.png" } };
    window.localStorage.setItem("user", JSON.stringify(userObj));

    render(<TestComponent />);
    const display = screen.getByTestId("user-value");
    expect(display.textContent).toBe(JSON.stringify(userObj));
  });

  it("updates when authChange event is dispatched", () => {
    const initialUser = { name: "Bob" };
    window.localStorage.setItem("user", JSON.stringify(initialUser));

    render(<TestComponent />);
    let display = screen.getByTestId("user-value");
    expect(display.textContent).toBe(JSON.stringify(initialUser));

    const updatedUser = { name: "Carol" };
    window.localStorage.setItem("user", JSON.stringify(updatedUser));

    act(() => {
      window.dispatchEvent(new Event("authChange"));
    });

    display = screen.getByTestId("user-value");
    expect(display.textContent).toBe(JSON.stringify(updatedUser));
  });
});
