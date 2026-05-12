import { useEffect, useRef, useState } from 'react';

interface Props {
  value: number;
  min: number;
  max: number;
  step: number;
  delay?: number;
  className?: string;
  onCommit: (value: number) => void;
  onCommitImmediate?: (value: number) => void; // fires on mouseup/touchend
}

/**
 * Range input that maintains snappy local UI while debouncing the parent commit.
 * - Renders immediately on every drag tick.
 * - Calls onCommit after the user pauses (delay ms) or releases the slider.
 */
export default function DebouncedRange({ value, min, max, step, delay = 250, className, onCommit, onCommitImmediate }: Props) {
  const [local, setLocal] = useState(value);
  const timerRef = useRef<number | null>(null);
  const draggingRef = useRef(false);

  // Sync external changes only when not dragging.
  useEffect(() => {
    if (!draggingRef.current) setLocal(value);
  }, [value]);

  const flush = (v: number) => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    onCommit(v);
    onCommitImmediate?.(v);
  };

  const schedule = (v: number) => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      onCommit(v);
      timerRef.current = null;
    }, delay);
  };

  useEffect(() => () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
  }, []);

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={local}
      onChange={e => {
        const v = Number(e.target.value);
        draggingRef.current = true;
        setLocal(v);
        schedule(v);
      }}
      onMouseUp={() => { draggingRef.current = false; flush(local); }}
      onTouchEnd={() => { draggingRef.current = false; flush(local); }}
      onBlur={() => { draggingRef.current = false; flush(local); }}
      className={className}
    />
  );
}
