import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { formatText } from "./case-2";

describe("formatText", () => {
  beforeEach(() => {
    // 在每个测试前设置 spy
    vi.spyOn(console, "warn");
    vi.spyOn(console, "info");
  });

  afterEach(() => {
    // 在每个测试后清理 spy
    vi.restoreAllMocks();
  });

  // 基础测试：基本功能测试
  it("should handle basic text formatting", () => {
    const result = formatText("hello world");
    expect(result).toBe("hello world");
    expect(console.info).toHaveBeenCalledWith("Text has been trimmed");
  });

  // 空白测试：处理空格
  it("should trim whitespace when trim option is true", () => {
    const result = formatText("  hello  ");
    expect(result).toBe("hello");
    expect(console.info).toHaveBeenCalledWith("Text has been trimmed");
  });

  // 大写转换测试
  it("should convert to uppercase when uppercase option is true", () => {
    const result = formatText("hello", true);
    expect(result).toBe("HELLO");
    expect(console.info).toHaveBeenCalledTimes(2); // trim 和 uppercase 各调用一次
  });

  // 组合测试：同时使用多个选项
  it("should handle multiple options correctly", () => {
    const result = formatText("  hello world  ", true, true);
    expect(result).toBe("HELLO WORLD");
    expect(console.info).toHaveBeenCalledTimes(2);
  });

  // 边界测试：禁用所有选项
  it("should return original text when all options are false", () => {
    const result = formatText("  hello  ", false, false);
    expect(result).toBe("  hello  ");
    expect(console.info).not.toHaveBeenCalled();
  });

  // 异常处理测试：null 输入
  it("should handle null input", () => {
    const result = formatText(null as any);
    expect(result).toBe("");
    expect(console.warn).toHaveBeenCalledWith(
      "Input text is null or undefined"
    );
  });

  // 特殊字符测试
  it("should handle special characters correctly", () => {
    const result = formatText("Hello@世界#123", true);
    expect(result).toBe("HELLO@世界#123");
    expect(console.info).toHaveBeenCalledTimes(2);
  });
});
