/* eslint-env jest */
import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MyButton from "./my-button";
import "@testing-library/jest-dom";

// 测试分组：验证按钮的 props 功能
describe("MyButton 组件 props 测试", () => {
  // 用例1：验证基础文本渲染
  it("应正确显示传入的文本内容", () => {
    // 使用 testing-library 渲染组件并获取 DOM 元素
    render(<MyButton text="点击我" />);
    // 通过 data-testid 定位元素并验证文本内容
    expect(screen.getByTestId("custom-button").textContent).toBe("点击我");
  });

  // 用例2：验证 type 类名应用
  it("应根据 type 属性添加对应的 CSS 类", () => {
    const { rerender } = render(<MyButton text="测试" type="primary" />);
    // 验证默认 type 的类名
    expect(screen.getByTestId("custom-button")).toHaveClass("primary");

    // 动态更新 props 重新渲染
    rerender(<MyButton text="测试" type="secondary" />);
    expect(screen.getByTestId("custom-button")).toHaveClass("secondary");

    rerender(<MyButton text="测试" type="danger" />);
    expect(screen.getByTestId("custom-button")).toHaveClass("danger");
  });

  // 用例3：验证尺寸类名
  it("应根据 size 属性添加尺寸类名", () => {
    const { rerender } = render(<MyButton text="测试" size="small" />);
    expect(screen.getByTestId("custom-button")).toHaveClass("small");

    rerender(<MyButton text="测试" size="medium" />);
    expect(screen.getByTestId("custom-button")).toHaveClass("medium");

    rerender(<MyButton text="测试" size="large" />);
    expect(screen.getByTestId("custom-button")).toHaveClass("large");
  });

  // 用例4：验证禁用状态
  it("应正确应用 disabled 属性", () => {
    // 测试禁用状态
    render(<MyButton text="禁用按钮" disabled={true} />);
    const button = screen.getByTestId("custom-button");
    expect(button).toBeDisabled();
    expect(button).toHaveClass("disabled"); // 假设你的 CSS 有对应禁用样式类

    // 测试非禁用状态
    render(<MyButton text="正常按钮" disabled={false} />);
    expect(screen.getByText("正常按钮")).not.toBeDisabled();
  });

  // 用例5：验证默认值应用
  it("应正确应用默认 prop 值", () => {
    render(<MyButton text="默认按钮" />);
    const button = screen.getByTestId("custom-button");

    // 验证 type 默认值
    expect(button).toHaveClass("primary");
    // 验证 size 默认值
    expect(button).toHaveClass("medium");
    // 验证 disabled 默认值
    expect(button).not.toBeDisabled();
  });
});
