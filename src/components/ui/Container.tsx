interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  /**
   * `wide`  — default 7xl editorial width
   * `full`  — bleeds to viewport edges for section breakouts
   * `narrow`— tighter reading column
   */
  width?: "wide" | "full" | "narrow";
}

const MAX: Record<NonNullable<ContainerProps["width"]>, string> = {
  wide: "max-w-[min(92rem,100%)]",
  full: "max-w-none",
  narrow: "max-w-3xl",
};

export function Container({
  children,
  className = "",
  width = "wide",
}: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full ${MAX[width]} px-[clamp(1.25rem,4vw,3.5rem)] ${className}`}
    >
      {children}
    </div>
  );
}
