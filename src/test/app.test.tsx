import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "@/App";
import { brand } from "@/config/brand";
import { queryClient } from "@/lib/query-client";
import { useAuthStore } from "@/store/auth";

function visit(path: string, authenticated = false) {
  window.history.pushState({}, "", path);
  queryClient.clear();
  useAuthStore.setState(
    authenticated
      ? {
          token: "test_token",
          user: {
            id: "test",
            name: "Maya Chen",
            email: "maya@example.com",
            company: "Northstar Capital",
            plan: "Team",
          },
        }
      : { token: null, user: null },
  );
  return render(<App />);
}

describe("public experience and auth", () => {
  it("uses centralized brand copy across the marketing landing page", () => {
    visit("/");
    expect(screen.getByText(brand.tagline)).toBeInTheDocument();
    expect(screen.getAllByText(brand.product).length).toBeGreaterThan(0);
    for (const module of brand.modules)
      expect(screen.getAllByText(module.title).length).toBeGreaterThan(0);
    expect(screen.getByTestId("hero-cta")).toHaveAttribute("href", "/signup");
  });

  it("guards console routes and supports demo authentication", async () => {
    const user = userEvent.setup();
    visit("/app");
    expect(await screen.findByText(brand.auth.loginTitle)).toBeInTheDocument();
    await user.click(screen.getByTestId("demo-login"));
    expect(await screen.findByTestId("dashboard-page")).toBeInTheDocument();
    expect(useAuthStore.getState().token).toBe("corvex_demo_token");
  });

  it("validates and accepts any email with a nonempty password", async () => {
    const user = userEvent.setup();
    visit("/login");
    await user.type(screen.getByTestId("email-input"), "analyst@example.com");
    await user.type(screen.getByTestId("password-input"), "anything");
    await user.click(screen.getByTestId("auth-submit"));
    expect(await screen.findByTestId("dashboard-page")).toBeInTheDocument();
  });
});

describe("console workflows", () => {
  it("loads dashboard usage and activity", async () => {
    visit("/app", true);
    expect(await screen.findByText("Research activity")).toBeInTheDocument();
    expect(screen.getAllByText(/AI queries/).length).toBeGreaterThan(0);
    expect(screen.getByText("Recent activity")).toBeInTheDocument();
  });

  it("searches and filters explorer sources and opens a document", async () => {
    const user = userEvent.setup();
    visit("/app/explorer", true);
    const search = await screen.findByTestId("explorer-search");
    await user.type(search, "Nvidia");
    await waitFor(() => expect(screen.getByTestId("result-count")).toHaveTextContent("5 results"));
    expect(within(screen.getByTestId("explorer-results")).getAllByText(/Nvidia/).length).toBeGreaterThan(0);
    await user.clear(search);
    await user.selectOptions(screen.getByTestId("sector-filter"), "Energy");
    await waitFor(() => expect(screen.getByTestId("result-count")).toHaveTextContent("5 results"));
    expect(await screen.findByTestId("document-viewer")).toHaveTextContent("NextEra Energy");
  });

  it("sends assistant questions and links citations to explorer documents", async () => {
    const user = userEvent.setup();
    visit("/app/assistant", true);
    await user.type(screen.getByTestId("assistant-input"), "What changed in AI spending?");
    await user.click(screen.getByTestId("assistant-send"));
    expect(screen.getByText("What changed in AI spending?")).toBeInTheDocument();
    const citations = await screen.findByTestId("assistant-citations", {}, { timeout: 3000 });
    expect(within(citations).getAllByRole("link")).toHaveLength(3);
    expect(within(citations).getAllByRole("link")[0]).toHaveAttribute(
      "href",
      expect.stringContaining("/app/explorer?document="),
    );
  });

  it("opens the cited document encoded in an explorer link", async () => {
    visit("/app/explorer?document=doc-2", true);
    expect(await screen.findByTestId("document-viewer")).toHaveTextContent("Microsoft");
  });

  it("creates a reveal-once key then optimistically revokes it", async () => {
    const user = userEvent.setup();
    visit("/app/integrations", true);
    expect(await screen.findByText("Production research")).toBeInTheDocument();
    await user.click(screen.getByTestId("create-key-open"));
    await user.type(screen.getByTestId("key-name"), "Test automation");
    await user.click(screen.getByTestId("create-key-submit"));
    expect(await screen.findByTestId("key-secret")).toHaveTextContent("demo_secret_reveal_once");
    await user.click(screen.getByText("I have saved my key"));
    expect(await screen.findByText("Test automation")).toBeInTheDocument();
    await user.click(screen.getByLabelText("Revoke Test automation"));
    await waitFor(() => expect(screen.queryByText("Test automation")).not.toBeInTheDocument());
  });
});
