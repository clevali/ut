import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { getUserData } from "./case-3";

// 模拟 axios 模块
vi.mock("axios");

describe("getUserData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 基础测试：成功获取用户数据
  it("should return formatted user name", async () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: { id: 1, name: "John Doe", age: 30 },
    });

    const result = await getUserData(1);
    expect(result).toBe("John Doe");
    expect(axios.get).toHaveBeenCalledWith("/api/users/1");
  });

  // 包含年龄信息测试
  it("should include age when includeAge is true", async () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: { id: 1, name: "John Doe", age: 30 },
    });

    const result = await getUserData(1, true);
    expect(result).toBe("John Doe (30 years old)");
  });

  // 错误处理测试：API 调用失败
  it("should handle API errors gracefully", async () => {
    vi.mocked(axios.get).mockRejectedValue(new Error("Network error"));

    const result = await getUserData(1);
    expect(result).toBe("Error fetching user data");
  });

  // 边界测试：无效的用户ID
  it("should throw error for invalid user ID", async () => {
    await expect(getUserData(0)).rejects.toThrow("Invalid user ID");
    await expect(getUserData(-1)).rejects.toThrow("Invalid user ID");
  });

  // 空值测试：用户名为空
  it("should handle empty user name", async () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: { id: 1, name: "", age: 30 },
    });

    const result = await getUserData(1);
    expect(result).toBe("Unknown user");
  });

  // 验证 API 调用参数
  it("should call API with correct parameters", async () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: { id: 1, name: "John Doe", age: 30 },
    });

    await getUserData(123);
    expect(axios.get).toHaveBeenCalledWith("/api/users/123");
    expect(axios.get).toHaveBeenCalledTimes(1);
  });
});
