import { motion, useScroll } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      style={{ scaleX: scrollYProgress, transformOrigin: "0% 50%" }}
      className="fixed top-0 left-0 right-0 h-[2px] z-[90]"
    >
      <div className="h-full w-full" style={{ background: "var(--gradient-gold-cyan)" }} />
    </motion.div>
  );
}
