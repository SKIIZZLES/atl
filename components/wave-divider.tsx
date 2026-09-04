import { useId } from "react";

export function WaveDivider({
  color = "var(--brass)",
  className = "",
}: {
  color?: string;
  className?: string;
}) {
  const patternId = `onde-wave-${useId()}`;

  return (
    <svg
      viewBox="0 0 160 28"
      preserveAspectRatio="none"
      className={`h-5 w-full md:h-7 ${className}`}
      aria-hidden="true"
    >
      <pattern
        id={patternId}
        width="40"
        height="28"
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M-2 14 C 3 4, 13 4, 18 14 S 33 24, 38 14 S 48 4, 53 14"
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </pattern>
      <rect width="160" height="28" fill={`url(#${patternId})`} />
    </svg>
  );
}
