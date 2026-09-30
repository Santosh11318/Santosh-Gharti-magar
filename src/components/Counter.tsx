import { useEffect, useState, useRef } from "react";
import { useInView, animate } from "motion/react";

interface CounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

export default function Counter({ end, duration = 1.8, prefix = "", suffix = "" }: CounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  
  // Triggers whenever element enters viewport (visible scroll-triggered animation)
  const isInView = useInView(ref, { once: false, amount: 0.15 });

  useEffect(() => {
    if (!isInView) {
      setDisplayValue(0);
      return;
    }

    const controls = animate(0, end, {
      duration: duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(value) {
        setDisplayValue(Math.round(value));
      },
    });

    return () => controls.stop();
  }, [isInView, end, duration]);

  // Handle immediate presence (e.g., if page loaded directly on this section)
  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const inViewNow = rect.top < window.innerHeight && rect.bottom > 0;
      if (inViewNow) {
        const controls = animate(0, end, {
          duration: duration,
          ease: [0.16, 1, 0.3, 1],
          onUpdate(value) {
            setDisplayValue(Math.round(value));
          },
        });
        return () => controls.stop();
      }
    }
  }, [end, duration]);

  return (
    <span ref={ref} className="tabular-nums inline-block">
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
}
