import { BeatLoader } from "react-spinners";

export function Loader({ color }: { color?: string }) {
  return (
    <BeatLoader
      color={color || "hsl(var(--primary))"}
      size={8}
      loading={true}
    />
  );
}
