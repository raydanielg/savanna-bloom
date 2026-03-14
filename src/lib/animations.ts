export const easeOutQuint = [0.23, 1, 0.32, 1] as [number, number, number, number];

export const transition = { duration: 0.6, ease: easeOutQuint };

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
  transition,
};

export const staggerDelay = (i: number, multiplier = 0.1) => ({
  duration: 0.6,
  ease: easeOutQuint,
  delay: i * multiplier,
});
