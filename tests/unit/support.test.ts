import { beforeEach, describe, expect, it, vi } from "vitest";

const mockSend = vi.fn().mockResolvedValue({
  data: { id: "test-support-email-id" },
  error: null,
});

vi.mock("resend", () => {
  return {
    Resend: class MockResend {
      emails = {
        send: mockSend,
      };
    },
  };
});

// Set environment variable before importing email module
process.env.RESEND_API_KEY = "re_test_dummy_key";

import {
  SUPPORT_ADMIN_EMAIL,
  sendSupportInquiryEmail,
  sendSupportConfirmationEmail,
} from "@/lib/email";

describe("Customer Support Email & Routing", () => {
  beforeEach(() => {
    mockSend.mockClear();
  });

  it("defaults SUPPORT_ADMIN_EMAIL to metoaipr@gmail.com", () => {
    expect(SUPPORT_ADMIN_EMAIL).toBe("metoaipr@gmail.com");
  });

  it("formats and dispatches support inquiry notification to metoaipr@gmail.com", async () => {
    const result = await sendSupportInquiryEmail({
      customerEmail: "developer@example.com",
      customerName: "Alex Dev",
      category: "mcp_setup",
      subject: "Cursor MCP timeout in WSL2",
      message: "I am trying to run mcp-remote on port 3000 but it hangs.",
      metadata: {
        username: "alexdev",
        url: "https://www.metoctx.com/settings",
      },
    });

    expect(result.success).toBe(true);
    expect(result.id).toBe("test-support-email-id");

    // Verify recipient and replyTo
    expect(mockSend).toHaveBeenCalledTimes(1);
    const sentPayload = mockSend.mock.calls[0][0];
    expect(sentPayload.to).toContain("metoaipr@gmail.com");
    expect(sentPayload.replyTo).toBe("developer@example.com");
    expect(sentPayload.subject).toContain("Cursor MCP timeout in WSL2");
    expect(sentPayload.html).toContain("alexdev");
  });

  it("handles confirmation receipt email to the customer with self-help tip for MCP", async () => {
    const result = await sendSupportConfirmationEmail({
      customerEmail: "developer@example.com",
      customerName: "Alex Dev",
      category: "mcp_setup",
      subject: "Cursor MCP timeout in WSL2",
    });

    expect(result.success).toBe(true);
    expect(result.id).toBe("test-support-email-id");

    expect(mockSend).toHaveBeenCalledTimes(1);
    const sentPayload = mockSend.mock.calls[0][0];
    expect(sentPayload.to).toContain("developer@example.com");
    expect(sentPayload.html).toContain("npx @metoai/cli health");
  });

  it("handles general inquiry confirmation receipt", async () => {
    const result = await sendSupportConfirmationEmail({
      customerEmail: "user@example.com",
      category: "general",
      subject: "Question about privacy",
    });

    expect(result.success).toBe(true);
    expect(mockSend).toHaveBeenCalledTimes(1);
    const sentPayload = mockSend.mock.calls[0][0];
    expect(sentPayload.to).toContain("user@example.com");
  });
});
