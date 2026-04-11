// src/components/ui/Button.tsx
// Unified Button / <Button as="a">. Variants:
//   - "primary"  red CTA
//   - "ghost"    transparent with border
//   - "aurora"   animated aurora gradient (used by WhatsApp CTA)
//
// Interactions:
//   - `magnetic`: cursor-attract transform up to ~8px with --ease-spring return
//   - `ripple`:   bloom radial on click (respects --ripple-x / --ripple-y)
// Both bail on touch (`pointer: coarse`) and `prefers-reduced-motion: reduce`.
"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ElementType,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

type Variant = "primary" | "ghost" | "aurora";

type ButtonOwnProps = {
  variant?: Variant;
  magnetic?: boolean;
  ripple?: boolean;
  children: ReactNode;
  className?: string;
};

type AsProp<E extends ElementType> = { as?: E };

type ButtonProps<E extends ElementType = "button"> = ButtonOwnProps &
  AsProp<E> &
  Omit<ComponentPropsWithoutRef<E>, keyof ButtonOwnProps | "as">;

const baseClasses =
  "btn-base inline-flex items-center justify-center gap-3 font-mono text-[0.72rem] font-semibold uppercase tracking-[0.25em] transition-colors select-none";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-brand text-ink-950 px-8 py-5 hover:bg-brand-hot focus-visible:outline-offset-4",
  ghost:
    "border border-border text-text px-8 py-5 hover:border-brand hover:text-brand",
  aurora: "aurora text-ink-950 px-8 py-5",
};

function canHover(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

const ButtonImpl = forwardRef<HTMLElement, ButtonProps>(function Button(
  {
    as,
    variant = "primary",
    magnetic = false,
    ripple = false,
    children,
    className = "",
    onClick,
    onPointerMove,
    onPointerLeave,
    ...rest
  },
  forwardedRef,
) {
  const Tag = (as ?? "button") as ElementType;
  const localRef = useRef<HTMLElement | null>(null);
  const [interactive, setInteractive] = useState(false);

  const setRef = useCallback(
    (node: HTMLElement | null) => {
      localRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    [forwardedRef],
  );

  // Feature-detect on mount (hover-capable + not reduced-motion).
  // A one-shot touchstart listener hard-disables magnetism on iPad-with-keyboard.
  useEffect(() => {
    if (!magnetic) return;
    setInteractive(canHover());
    const killOnTouch = () => setInteractive(false);
    window.addEventListener("touchstart", killOnTouch, {
      once: true,
      passive: true,
    });
    return () => window.removeEventListener("touchstart", killOnTouch);
  }, [magnetic]);

  const magnetFrame = useRef<number | null>(null);
  const handlePointerMove = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      (onPointerMove as ((ev: ReactPointerEvent<HTMLElement>) => void) | undefined)?.(e);
      if (!interactive || !magnetic) return;
      const node = localRef.current;
      if (!node) return;
      if (magnetFrame.current !== null)
        cancelAnimationFrame(magnetFrame.current);
      const rect = node.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      const max = 8;
      magnetFrame.current = requestAnimationFrame(() => {
        node.style.setProperty("--mag-x", `${dx * max}px`);
        node.style.setProperty("--mag-y", `${dy * max}px`);
      });
    },
    [interactive, magnetic, onPointerMove],
  );

  const handlePointerLeave = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      (onPointerLeave as ((ev: ReactPointerEvent<HTMLElement>) => void) | undefined)?.(e);
      if (!interactive || !magnetic) return;
      const node = localRef.current;
      if (!node) return;
      node.style.setProperty("--mag-x", "0px");
      node.style.setProperty("--mag-y", "0px");
    },
    [interactive, magnetic, onPointerLeave],
  );

  const handleClick = useCallback(
    (e: ReactMouseEvent<HTMLElement>) => {
      (onClick as ((ev: ReactMouseEvent<HTMLElement>) => void) | undefined)?.(e);
      if (!ripple) return;
      if (
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      )
        return;
      const node = localRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      node.style.setProperty("--ripple-x", `${x}%`);
      node.style.setProperty("--ripple-y", `${y}%`);
      node.style.setProperty("--ripple-scale", "0");
      // Force style recalc then play
      requestAnimationFrame(() => {
        node.style.setProperty("--ripple-scale", "2.5");
      });
      window.setTimeout(() => {
        node.style.setProperty("--ripple-scale", "0");
      }, 700);
    },
    [onClick, ripple],
  );

  const composed =
    `${baseClasses} ${variantClasses[variant]} ${ripple ? "btn-ripple" : ""} ${
      magnetic && interactive ? "btn-magnetic" : ""
    } ${className}`.trim();

  return (
    <Tag
      ref={setRef}
      className={composed}
      onClick={handleClick}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      {...rest}
    >
      <span className="relative z-[2] inline-flex items-center gap-3">
        {children}
      </span>
    </Tag>
  );
});

export const Button = ButtonImpl as <E extends ElementType = "button">(
  props: ButtonProps<E> & { ref?: React.Ref<HTMLElement> },
) => ReturnType<typeof ButtonImpl>;
