import React from "react";
import { describe, test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MyButton from "./my-button";
import "@testing-library/jest-dom";

describe("MyButton组件异常处理测试", () => {
  // 测试用例1：onClick异步错误捕获
  test("当onClick抛出异常时应正确捕获并记录错误", async () => {
    // 模拟一个会抛出错误的点击处理函数
    const error = new Error("测试错误");
    const errorHandler = vi.fn().mockRejectedValueOnce(error);
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    // 渲染禁用状态的按钮
    render(<MyButton text="危险按钮" onClick={errorHandler} type="danger" />);

    // 获取按钮元素
    const button = screen.getByTestId("custom-button");

    // 模拟用户点击（使用user-event更接近真实交互）
    await userEvent.click(button);

    // 验证错误处理
    expect(errorHandler).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith(error);

    // 清理mock
    consoleSpy.mockRestore();
  });

  // 测试用例2：禁用状态下的行为控制
  test("禁用状态下应阻止所有交互事件", async () => {
    // 创建会抛出错误的mock函数
    const clickHandler = vi.fn(() => {
      throw new Error();
    });
    const doubleClickHandler = vi.fn(() => {
      throw new Error();
    });
    const hoverHandler = vi.fn(() => {
      throw new Error();
    });

    // 渲染禁用状态的按钮
    render(
      <MyButton
        text="禁用按钮"
        disabled={true}
        onClick={clickHandler}
        onDoubleClick={doubleClickHandler}
        onHover={hoverHandler}
      />
    );

    const button = screen.getByTestId("custom-button");

    // 模拟各种交互
    await userEvent.click(button);
    await userEvent.dblClick(button);
    fireEvent.mouseEnter(button);

    // 验证所有处理器均未被调用
    expect(clickHandler).not.toHaveBeenCalled();
    expect(doubleClickHandler).not.toHaveBeenCalled();
    expect(hoverHandler).not.toHaveBeenCalled();

    // 验证DOM状态
    expect(button).toBeDisabled();
    expect(button).toHaveClass("disabled");
  });
});
