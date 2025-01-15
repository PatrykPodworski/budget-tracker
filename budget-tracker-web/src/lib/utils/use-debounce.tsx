import { useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";

export const useDebounce = (callback: (value: string) => Promise<void>) => {
  const [isLoading, startTransition] = useTransition();
  const debounced = useDebouncedCallback(
    (value: string) => startTransition(() => callback(value)),
    500
  );

  return { isLoading, debounced };
};
