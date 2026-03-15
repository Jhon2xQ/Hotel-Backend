import { vi } from "vitest";
import { AppContext } from "../../src/common/types/app.types";

export function createMockContext(overrides?: Partial<AppContext>): AppContext {
  return {
    req: {
      param: vi.fn(),
      json: vi.fn(),
    },
    json: vi.fn(),
    get: vi.fn(),
    set: vi.fn(),
  } as any;
}
