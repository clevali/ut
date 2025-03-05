import React from "react";
import "./my-button.css";

export interface ButtonProps {
  text: string;
  type?: "primary" | "secondary" | "danger";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
  onHover?: () => void;
}

const MyButton: React.FC<ButtonProps> = ({
  text,
  type = "primary",
  size = "medium",
  disabled = false,
  onClick,
  onDoubleClick,
  onHover,
}) => {
  return (
    <button
      className={`custom-button ${type} ${size}${disabled ? " disabled" : ""}`}
      disabled={disabled}
      role="button"
      onClick={async () => {
        try {
          await onClick?.();
        } catch (error) {
          console.error(error);
        }
      }}
      onDoubleClick={onDoubleClick}
      onMouseEnter={onHover}
      data-testid="custom-button"
    >
      {text}
    </button>
  );
};

export default MyButton;
