import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import NotFound from "#/components/not-found";
import { MemoryRouter } from "react-router-dom";

describe("GlobalError", () => {
  test("renders error message and reset button", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    const errorMessage = screen.getByText(/Not Found!/i);
    expect(errorMessage).toBeDefined();

    const resetButton = screen.getByRole("button", { name: /back to Home/i });
    expect(resetButton).toBeDefined();
  });
});
