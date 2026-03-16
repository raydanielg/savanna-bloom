import { useRef } from "react";
import { useInView, motion, type Variant } from "framer-motion";

const easeOutQuint = [0.23, 1, 0.32, 1] as [number, number, number, number];

interface ScrollAnimationProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
  duration?: number;
  once?: boolean;
  scale?: boolean;
}

export const ScrollReveal = ({
  children,
  className = "",
  delay = 0,
  direction = "up",
  distance = 40,
  duration = 0.7,
  once = true,
  scale = false,
}: ScrollAnimationProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-80px" });

  const dirMap = {
    up: { y: distance, x: 0 },
    down: { y: -distance, x: 0 },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{
        opacity: 0,
        ...dirMap[direction],
        ...(scale ? { scale: 0.95 } : {}),
      }}
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0, ...(scale ? { scale: 1 } : {}) }
          : { opacity: 0, ...dirMap[direction], ...(scale ? { scale: 0.95 } : {}) }
      }
      transition={{ duration, ease: easeOutQuint, delay }}
    >
      {children}
    </motion.div>
  );
};

export const ParallaxImage = ({
  src,
  alt,
  className = "",
  speed = 0.3,
}: {
  src: string;
  alt: string;
  className?: string;
  speed?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-[120%] object-cover"
        style={{ y: 0 }}
        initial={{ scale: 1.1 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 1.2, ease: easeOutQuint }}
        viewport={{ once: true }}
      />
    </div>
  );
};

export const StaggerContainer = ({
  children,
  className = "",
  staggerDelay = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOutQuint } },
      }}
    >
      {children}
    </motion.div>
  );
};
