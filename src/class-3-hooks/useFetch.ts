// useFetch.ts
import { useState, useEffect } from "react";

type FetchOptions = {
  manual?: boolean; // 是否手动触发请求
};

export default function useFetch<T>(url: string, options?: FetchOptions) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 核心请求方法
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const result = (await response.json()) as T;
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  // 自动触发逻辑
  useEffect(() => {
    if (!options?.manual) {
      fetchData();
    }
  }, [url, options?.manual]); // 依赖 url 变化自动重新请求

  return { data, loading, error, refetch: fetchData };
}
