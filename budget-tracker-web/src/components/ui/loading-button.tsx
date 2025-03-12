import { Button } from "./shadcn/button";

// TODO: P1 Keep the label and add animated icon
export const LoadingButton = ({
  loading,
  children,
  disabled,
  ...props
}: LoadingButtonProps) => {
  return (
    <Button {...props} disabled={loading || disabled}>
      {loading ? "Loading..." : children}
    </Button>
  );
};

type LoadingButtonProps = {
  loading: boolean;
} & React.ComponentProps<typeof Button>;
