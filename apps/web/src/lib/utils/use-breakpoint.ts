import { useMediaQuery } from "react-responsive";
import tailwindConfig from "@/../tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";

const config = resolveConfig(tailwindConfig);

const breakpoints = config.theme.screens;
type Breakpoint = keyof typeof breakpoints;

export const useBreakpoint = (breakpoint: Breakpoint) => {
  const query = `(min-width: ${breakpoints[breakpoint]})`;
  return useMediaQuery({ query });
};
