// useFetch.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import useFetch from "./useFetch";

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("useFetch 边缘场景测试", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  // 测试场景 1：组件卸载后中止状态更新
  it("组件卸载后不更新过时请求的状态", async () => {
    // 创建未完成的 Promise 模拟慢请求
    let resolveRequest: (value: any) => void;
    const pendingPromise = new Promise((resolve) => {
      resolveRequest = resolve;
    });

    mockFetch.mockImplementationOnce(() => pendingPromise);

    const { result, unmount } = renderHook(() => useFetch("/api/unmount-test"));
    expect(result.current.loading).toBe(true);

    // 在请求完成前卸载组件
    unmount();

    // 解析请求（此时组件已卸载）
    resolveRequest!({
      ok: true,
      json: () => Promise.resolve({ data: "stale" }),
    });

    // 等待可能的更新
    await new Promise((resolve) => setTimeout(resolve, 50));

    // 验证状态未更新（通过保留卸载前的状态快照）
    expect(result.current.loading).toBe(true); // 保持卸载时的 loading 状态
    expect(result.current.data).toBeNull();
  });

  // 测试场景 2：快速连续手动触发请求
  it("应只保留最后一次请求的结果", async () => {
    // 模拟三次响应（前两次慢，最后一次快）
    mockFetch
      .mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () => resolve({ ok: true, json: () => ({ id: 1 }) }),
              100
            )
          )
      )
      .mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () => resolve({ ok: true, json: () => ({ id: 2 }) }),
              100
            )
          )
      )
      .mockImplementationOnce(() =>
        Promise.resolve({ ok: true, json: () => ({ id: 3 }) })
      );

    const { result } = renderHook(() =>
      useFetch("/api/race", { manual: true })
    );

    // 连续触发三次请求
    result.current.refetch(); // 请求1
    result.current.refetch(); // 请求2
    result.current.refetch(); // 请求3

    await waitFor(
      () => {
        // 应只显示最后一次请求的结果
        expect(result.current.data).toEqual({ id: 3 });
      },
      { timeout: 500 }
    );
  });

  // 测试场景 3：URL 参数突变测试
  it("URL 快速变化时应处理最新请求", async () => {
    const { result, rerender } = renderHook(({ url }) => useFetch(url), {
      initialProps: { url: "/api/initial" },
    });

    // 快速连续改变 URL
    rerender({ url: "/api/update1" });
    rerender({ url: "/api/update2" });

    // 模拟最终 URL 的响应
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ version: "final" }),
    });

    await waitFor(() => {
      // 应只处理最后一次 URL 的请求
      expect(mockFetch).toHaveBeenLastCalledWith("/api/update2");
      expect(result.current.data).toEqual({ version: "final" });
    });
  });

  // 测试场景 4：手动触发后立即改变自动触发条件
  it("手动请求与自动请求冲突时应正确处理", async () => {
    const { result, rerender } = renderHook(
      ({ manual }) => useFetch("/api/conflict", { manual }),
      { initialProps: { manual: true } }
    );

    // 触发手动请求
    act(() => {
      result.current.refetch();
    });
    // 在请求完成前切换为自动模式
    rerender({ manual: false });

    // 模拟响应（此时应忽略自动触发的请求）
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ status: "manual" }),
    });

    await waitFor(() => {
      // 应保留手动请求的结果
      expect(result.current.data).toEqual({ status: "manual" });
      expect(mockFetch).toHaveBeenCalledTimes(1); // 只触发一次
    });
  });
});
