/**
 * 格式化文本，将文本转换为指定格式
 * @param text 输入文本
 * @param uppercase 是否转换为大写
 * @param trim 是否移除首尾空格
 * @returns 格式化后的文本
 */
export function formatText(
  text: string,
  uppercase: boolean = false,
  trim: boolean = true
): string {
  if (text === undefined || text === null) {
    console.warn("Input text is null or undefined");
    return "";
  }

  let result = String(text);

  if (trim) {
    result = result.trim();
    console.info("Text has been trimmed");
  }

  if (uppercase) {
    result = result.toUpperCase();
    console.info("Text has been converted to uppercase");
  }

  return result;
}
