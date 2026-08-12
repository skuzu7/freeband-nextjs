import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NavBar } from "../NavBar";

describe("NavBar", () => {
  it("closes the mobile menu with Escape and returns focus to the trigger", () => {
    render(<NavBar />);

    const trigger = screen.getByRole("button", { name: "Abrir menu" });
    trigger.focus();
    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(document.body).toHaveStyle({ overflow: "hidden" });

    fireEvent.keyDown(document, { key: "Escape" });

    expect(trigger).toHaveAccessibleName("Abrir menu");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
    expect(document.body).not.toHaveStyle({ overflow: "hidden" });
  });
});
