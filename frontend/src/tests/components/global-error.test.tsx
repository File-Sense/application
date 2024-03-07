import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import GlobalError from "#/components/global-error";
import { MemoryRouter } from "react-router-dom";

describe("GlobalError", () => {
  test("renders error message and reset button", () => {
    render(
      <MemoryRouter>
        <GlobalError />
      </MemoryRouter>
    );

    const errorMessage = screen.getByText(/Oops Something went Wrong!/i);
    expect(errorMessage).toBeDefined();

    const resetButton = screen.getByRole("button", { name: /Reset/i });
    expect(resetButton).toBeDefined();
  });
});
