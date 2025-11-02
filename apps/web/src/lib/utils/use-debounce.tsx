import { useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";

export const useDebounce = <T extends Function>(callback: T) => {
  const [isLoading, startTransition] = useTransition();
  const debounced = useDebouncedCallback(
    (...params: Parameters<T>) => startTransition(() => callback(...params)),
    500
  );

  return { isLoading, debounced };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Function = (...args: any) => any;
