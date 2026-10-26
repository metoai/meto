import { describe, it, expect, vi } from "vitest";
import {
  generateCorrelationId,
  logger,
  measureLatency,
} from "@/lib/observability";

describe("observability", () => {
  it("generates unique correlation IDs with req_ prefix", () => {
    const id1 = generateCorrelationId();
    const id2 = generateCorrelationId();
    expect(id1).toMatch(/^req_[a-f0-9]{16}$/);
    expect(id2).toMatch(/^req_[a-f0-9]{16}$/);
    expect(id1).not.toBe(id2);
  });

  it("measures latency and logs success", async () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});

    const result = await measureLatency("test-op", async () => {
      return 42;
    });

    expect(result).toBe(42);
    expect(spy).toHaveBeenCalled();
    const logged = JSON.parse(spy.mock.calls[0][0]);
    expect(logged.operation).toBe("test-op");
    expect(logged.level).toBe("info");
    expect(typeof logged.durationMs).toBe("number");

    spy.mockRestore();
  });

  it("measures latency and logs error on failure", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(
      measureLatency("failing-op", async () => {
        throw new Error("Something broke");
      })
    ).rejects.toThrow("Something broke");

    expect(spy).toHaveBeenCalled();
    const logged = JSON.parse(spy.mock.calls[0][0]);
    expect(logged.operation).toBe("failing-op");
    expect(logged.level).toBe("error");
    expect(logged.error).toBe("Something broke");

    spy.mockRestore();
  });
});
