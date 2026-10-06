// src/components/historia/Node.tsx
// A lit dot on the timeline's rail, where an era begins.
export function Node() {
  return (
    <span
      aria-hidden
      className="absolute top-1.5 left-[calc(var(--dot-pitch)/2)] size-2.5 -translate-x-1/2 rounded-pill bg-led shadow-[0_0_10px_var(--color-led)]"
    />
  );
}
