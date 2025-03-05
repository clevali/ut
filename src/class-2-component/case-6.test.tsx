import React from "react";
import { describe, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import MyButton from "./my-button";
import "@testing-library/jest-dom";

// 模拟i18n配置（可复用网页1/7的配置逻辑
const mockI18n = {
  // 初始化为英文
  t: (key: string) =>
    ({ "button.submit": "Submit", "button.cancel": "Cancel" }[key]),
  changeLanguage: vi.fn(),
};

describe("MyButton i18n Tests", () => {
  test("显示英文翻译文本", () => {
    render(
      <I18nextProvider i18n={mockI18n as any}>
        <MyButton text={mockI18n.t("button.submit") || ""} />
      </I18nextProvider>
    );

    // 验证按钮文本是否符合英文翻译
    expect(screen.getByTestId("custom-button")).toHaveTextContent("Submit");
  });
});
