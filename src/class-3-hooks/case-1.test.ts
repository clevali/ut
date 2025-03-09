// useFetch.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import useFetch from "./useFetch";

// 模拟全局 fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// 模拟成功响应数据
const mockSuccessData = { id: 1, name: "Test Item" };

describe("useFetch 正常逻辑测试", () => {
  beforeEach(() => {
    mockFetch.mockReset(); // 每个测试前重置 mock 状态
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockSuccessData),
    }); // 默认模拟成功响应
  });

  // 测试场景 1：自动触发请求
  it("组件挂载时自动发起请求", async () => {
    const { result } = renderHook(() => useFetch("/api/data"));

    // 初始状态验证
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();

    // 等待请求完成
    await waitFor(
      () => {
        expect(result.current.loading).toBe(false); // 加载状态应结束
      },
      { timeout: 1000 }
    );
    await waitFor(
      () => {
        expect(result.current.data).toEqual(mockSuccessData); // 数据应正确设置
      },
      { timeout: 1000 }
    );
  });

  // 测试场景 2：手动触发请求
  it("manual=true 时手动触发请求", async () => {
    const { result } = renderHook(() =>
      useFetch("/api/manual", { manual: true })
    );

    // 初始不应自动请求
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();

    // 手动触发请求
    act(() => {
      result.current.refetch();
    });
    expect(result.current.loading).toBe(true); // 应立即进入加载状态

    await waitFor(() => {
      expect(result.current.data).toEqual(mockSuccessData); // 数据应正确加载
    });

    // 等待加载状态结束
    await waitFor(() => {
      expect(result.current.loading).toBe(false); // 加载状态应结束
    });
  });

  // 测试场景 3：URL 变化时重新请求
  it("URL 变化时自动重新请求", async () => {
    const { result, rerender } = renderHook(({ url }) => useFetch(url), {
      initialProps: { url: "/api/initial" },
    });

    // 初始请求
    await waitFor(() => expect(result.current.data).toBeTruthy());

    // 更改 URL 重新渲染
    rerender({ url: "/api/updated" });

    // 应触发重新请求
    expect(result.current.loading).toBe(true); // 进入加载状态
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2); // 验证第二次请求
    });
    await waitFor(() => {
      expect(mockFetch).toHaveBeenLastCalledWith("/api/updated");
    });
  });

  // 测试场景 4：loading 状态转换
  it("应正确处理 loading 状态生命周期", async () => {
    const { result } = renderHook(() => useFetch("/api/loading-test"));

    // 初始状态
    expect(result.current.loading).toBe(true);

    // 请求完成状态
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // 手动重新请求时状态变化
    act(() => {
      result.current.refetch();
    });
    expect(result.current.loading).toBe(true); // 重新请求立即进入加载状态
    await waitFor(() => expect(result.current.loading).toBe(false));
  });
});
