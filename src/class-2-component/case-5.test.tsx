import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import MyButton from "./my-button";

describe("MyButton无障碍测试套件", () => {
  // 测试用例1：验证基础无障碍属性
  it("应包含正确的ARIA角色与状态", () => {
    // 渲染禁用状态按钮
    const { rerender } = render(<MyButton text="提交" disabled={true} />);

    const button = screen.getByTestId("custom-button");

    // 验证基础角色属性
    expect(button).toHaveAttribute("role", "button"); // 语义化角色声明

    // 验证禁用状态的双重声明（同时使用disabled属性和aria-disabled）
    expect(button).toHaveAttribute("aria-disabled", "true"); // 为屏幕阅读器明确状态
    expect(button).toBeDisabled(); // 原生HTML禁用状态

    // 动态更新状态测试
    rerender(<MyButton text="激活按钮" disabled={false} />);
    expect(button).toHaveAttribute("aria-disabled", "false");
    expect(button).toBeEnabled();
  });

  // 测试用例2：验证键盘交互支持
  it("应支持键盘导航与操作", async () => {
    const mockClick = vi.fn();
    const { rerender } = render(
      <MyButton text="确认操作" onClick={mockClick} onDoubleClick={vi.fn()} />
    );

    const button = screen.getByTestId("custom-button");

    // 模拟Enter键触发（标准按钮操作）
    fireEvent.keyDown(button, { key: "Enter", code: "Enter" });
    expect(mockClick).toHaveBeenCalledTimes(1); //  键盘等效点击

    // 模拟Space键触发（备用操作方式）
    fireEvent.keyUp(button, { key: " ", code: "Space" });
    expect(mockClick).toHaveBeenCalledTimes(2); //  多种触发方式支持

    // 验证禁用状态的键盘阻断
    rerender(<MyButton text="禁用按钮" disabled={true} />);
    fireEvent.keyDown(button, { key: "Enter", code: "Enter" });
    expect(mockClick).toHaveBeenCalledTimes(2); // 调用次数不应增加
  });
});
