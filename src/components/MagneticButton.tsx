import { useRef, MouseEvent, ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function MagneticButton({
  children,
  href,
  className = "",
  onClick,
}: {
  children: ReactNode;
  href?: string;
  className?: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });

  const onMove = (e: MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set((e.clientX - r.left - r.width / 2) * 0.35);
    y.set((e.clientY - r.top - r.height / 2) * 0.35);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  const Inner = (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      className={`inline-flex ${className}`}
    >
      {children}
    </motion.div>
  );

  if (href) return <a href={href} onClick={onClick} className="inline-block">{Inner}</a>;
  return <button onClick={onClick} className="inline-block">{Inner}</button>;
}
