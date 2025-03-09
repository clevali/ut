// useFetch.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import useFetch from "./useFetch";

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("useFetch 异常逻辑测试", () => {
  beforeEach(() => {
    mockFetch.mockReset(); // 重置 mock 避免测试间相互影响
  });

  // 测试场景 1：网络层错误（如断网）
  it("应正确处理网络连接错误", async () => {
    const networkError = new Error("Network request failed");
    mockFetch.mockRejectedValueOnce(networkError);

    const { result } = renderHook(() => useFetch("/api/unstable"));

    // 初始加载状态
    expect(result.current.loading).toBe(true);

    await waitFor(
      () => {
        expect(result.current.error).toEqual(networkError); // 错误对象应正确传递
        expect(result.current.data).toBeNull(); // 数据保持为 null
        expect(result.current.loading).toBe(false); // 结束加载状态
      },
      { timeout: 1000 }
    );
  });

  // 测试场景 2：HTTP 错误状态码（如 500）
  it("应处理非 200 的 HTTP 状态码", async () => {
    // 模拟 500 错误响应
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ message: "Server error" }),
    });

    const { result } = renderHook(() => useFetch("/api/server-error"));

    await waitFor(() => {
      expect(result.current.error?.message).toContain("500"); // 错误消息包含状态码
      expect(result.current.data).toBeNull();
      expect(result.current.loading).toBe(false);
    });
  });

  // 测试场景 3：手动触发时的错误处理
  it("手动 refetch 时应保留前次数据", async () => {
    // 第一次成功，第二次失败
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: "initial" }),
      })
      .mockRejectedValueOnce(new Error("Refetch failed"));

    const { result } = renderHook(() => useFetch("/api/retry"));

    // 等待首次成功
    await waitFor(() => expect(result.current.data).toBeTruthy());

    // 手动触发失败请求
    act(() => {
      result.current.refetch();
    });
    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.error?.message).toBe("Refetch failed");
      expect(result.current.data).toEqual({ data: "initial" }); // 保留上次正确数据
      expect(result.current.loading).toBe(false);
    });
  });
});
