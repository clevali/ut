import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import MyButton from "./my-button";
import "@testing-library/jest-dom";

describe("MyButton 事件测试", () => {
  // 1. 测试单击事件
  it("点击按钮时应触发onClick事件", () => {
    // 创建模拟函数记录事件触发
    const onClickMock = vi.fn();

    // 渲染组件并绑定模拟函数
    render(<MyButton text="Click me" onClick={onClickMock} />);

    // 获取按钮元素并触发点击事件
    const button = screen.getByTestId("custom-button");
    fireEvent.click(button);

    // 验证事件是否触发
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  // 2. 测试双击事件
  it("双击按钮时应触发onDoubleClick事件", async () => {
    const onDoubleClickMock = vi.fn();
    render(<MyButton text="Double click" onDoubleClick={onDoubleClickMock} />);

    const button = screen.getByTestId("custom-button");
    // 连续触发两次点击事件模拟双击
    fireEvent.doubleClick(button);

    expect(onDoubleClickMock).toHaveBeenCalledTimes(1);
  });

  // 3. 测试悬停事件
  it("鼠标悬停时应触发onHover事件", () => {
    const onHoverMock = vi.fn();
    render(<MyButton text="Hover me" onHover={onHoverMock} />);

    const button = screen.getByTestId("custom-button");
    // 触发鼠标进入事件
    fireEvent.mouseEnter(button);

    expect(onHoverMock).toHaveBeenCalledTimes(1);
  });

  // 4. 测试禁用状态事件拦截
  it("禁用状态下不应触发任何事件", () => {
    const onClickMock = vi.fn();
    const onDoubleClickMock = vi.fn();
    const onHoverMock = vi.fn();

    // 渲染禁用状态的按钮
    render(
      <MyButton
        text="Disabled"
        disabled
        onClick={onClickMock}
        onDoubleClick={onDoubleClickMock}
        onHover={onHoverMock}
      />
    );

    const button = screen.getByTestId("custom-button");

    // 依次触发所有事件
    fireEvent.click(button);
    fireEvent.doubleClick(button);
    fireEvent.mouseEnter(button);

    // 验证所有事件均未触发
    expect(onClickMock).not.toHaveBeenCalled();
    expect(onDoubleClickMock).not.toHaveBeenCalled();
    expect(onHoverMock).not.toHaveBeenCalled();
  });

  // 5. 测试事件多次触发
  it("多次点击应正确记录触发次数", () => {
    const onClickMock = vi.fn();
    render(<MyButton text="Multi-click" onClick={onClickMock} />);

    const button = screen.getByTestId("custom-button");
    // 连续触发3次点击
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    expect(onClickMock).toHaveBeenCalledTimes(3);
  });
});
