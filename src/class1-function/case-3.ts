import axios from "axios";

export interface UserData {
  id: number;
  name: string;
  age: number;
}

/**
 * 处理用户数据并返回格式化的用户信息
 * @param userId 用户ID
 * @param includeAge 是否包含年龄信息
 * @returns 格式化后的用户信息
 */
export async function getUserData(
  userId: number,
  includeAge: boolean = false
): Promise<string> {
  if (!userId || userId < 1) {
    throw new Error("Invalid user ID");
  }
  console.log("执行-=-=-=");
  try {
    const response = await axios.get(`/api/users/${userId}`);
    console.log("执行response", response);
    const userData: UserData = response.data;

    if (!userData.name) {
      return "Unknown user";
    }

    return includeAge
      ? `${userData.name} (${userData.age} years old)`
      : userData.name;
  } catch (error) {
    return "Error fetching user data";
  }
}
