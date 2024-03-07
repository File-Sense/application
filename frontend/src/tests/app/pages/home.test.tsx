import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "#/app/pages/Home";

describe("Home", () => {
  test("should show text", () => {
    render(<Home />);
    expect(
      screen.getByText(
        /This application is currently in the pre alpha phase and has only the core functionalities available. Some features are still under development and not yet accessible. You are welcome to explore the application and report any bugs through the report an issue button in the settings menu./i
      )
    ).toBeDefined();
  });
});
