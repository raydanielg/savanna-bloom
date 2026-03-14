import type { Transition } from "framer-motion";

export const easeOutQuint: [number, number, number, number] = [0.23, 1, 0.32, 1];

export const transition: Transition = { duration: 0.6, ease: easeOutQuint };

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
  transition,
};

export const staggerDelay = (i: number): Transition => ({
  duration: 0.6,
  ease: easeOutQuint,
  delay: i * 0.1,
});
