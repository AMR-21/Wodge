import { BeatLoader } from "react-spinners";

export function Loader({ color }: { color?: string }) {
  return (
    <BeatLoader
      color={color || "rgb(var(--foreground))"}
      size={8}
      loading={true}
    />
  );
}
