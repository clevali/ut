import { describe, it, expect } from "vitest";
import { addWithLimit } from "./case-1";

describe("addWithLimit", () => {
  // 基础测试：测试正常情况
  it("should correctly add two numbers when sum is below limit", () => {
    expect(addWithLimit(5, 10)).toBe(15);
  });

  // 边界测试：测试结果等于限制值
  it("should return exact limit when sum equals limit", () => {
    expect(addWithLimit(50, 50)).toBe(100);
  });

  // 边界测试：测试结果超过限制值
  it("should return limit when sum exceeds limit", () => {
    expect(addWithLimit(60, 50)).toBe(100);
  });

  // 空值测试：测试无效输入
  it("should throw error for invalid input", () => {
    expect(() => addWithLimit("5" as any, 10)).toThrow("Invalid input");
  });

  // 自定义限制值测试
  it("should work with custom limit value", () => {
    expect(addWithLimit(15, 25, 30)).toBe(30);
  });
});
