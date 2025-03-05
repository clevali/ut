import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MyButton from "./my-button";

/**
 * 快照测试套件 - 验证组件在不同 props 下的渲染一致性
 * 通过生成 DOM 结构的快照，确保 UI 的意外变更能被及时发现
 */
describe("MyButton Snapshot Testing", () => {
  // 类型样式测试
  it("应该正确应用 primary 类型样式类名", () => {
    render(<MyButton text="主要按钮" type="primary" />);
    // 验证 DOM 元素是否包含预期的样式类名
    expect(screen.getByTestId("custom-button").className).contain("primary");
    expect(screen.getByTestId("custom-button").innerHTML).toBe("主要按钮");
  });

  // 基础用例 - 验证默认 props 的渲染
  it("渲染默认主按钮", () => {
    // 渲染组件并获取容器
    const { container } = render(<MyButton text="提交按钮" />);

    // 断言生成的 DOM 与上次快照匹配
    // 快照文件会自动生成在 __snapshots__ 目录
    expect(container).toMatchSnapshot();
  });

  // 验证次要按钮类型
  it("渲染 secondary 类型按钮", () => {
    const { container } = render(<MyButton text="取消操作" type="secondary" />);

    // 检查应用了 secondary 类名的按钮结构
    expect(container).toMatchSnapshot();
  });

  // 验证小尺寸按钮
  it("渲染 small 尺寸按钮", () => {
    const { container } = render(<MyButton text="小按钮" size="small" />);

    // 检查尺寸相关的样式类是否正确添加
    expect(container).toMatchSnapshot();
  });

  // 验证禁用状态
  it("渲染禁用状态按钮", () => {
    const { container } = render(<MyButton text="不可用按钮" disabled />);

    // 检查 disabled 属性和样式是否正确应用
    expect(container).toMatchSnapshot();
  });

  // 验证包含所有事件处理器的按钮
  it("渲染带有所有事件处理器的按钮", () => {
    const { container } = render(
      <MyButton
        text="交互按钮"
        onClick={() => console.log("点击")}
        onDoubleClick={() => console.log("双击")}
        onHover={() => console.log("悬停")}
      />
    );

    // 虽然事件处理器不会影响 DOM 结构
    // 但需要确保属性添加不会导致意外变更
    expect(container).toMatchSnapshot();
  });
});
