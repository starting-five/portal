import { Loader } from "lucide-react";

interface SpinnerProps {
  size?: number | string;
  className?: string;
}

export default function Spinner({ size = 40, className = "" }: SpinnerProps) {
  return (
    <Loader
      className={`animate-spin text-gray-400 ${className}`}
      style={{ width: size, height: size }}
      aria-label="Loading"
    />
  );
}
