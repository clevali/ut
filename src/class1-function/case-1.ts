/**
 * 计算两个数字的和，并确保结果不超过指定的最大值
 * @param a 第一个数字
 * @param b 第二个数字
 * @param maxValue 最大允许值
 * @returns 计算结果
 */
export function addWithLimit(
  a: number,
  b: number,
  maxValue: number = 100
): number {
  if (typeof a !== "number" || typeof b !== "number") {
    throw new Error("Invalid input: parameters must be numbers");
  }

  const sum = a + b;
  return sum > maxValue ? maxValue : sum;
}
