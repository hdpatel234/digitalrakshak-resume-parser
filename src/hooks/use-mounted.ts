import { useState, useEffect } from "react";

/**
 * Returns true after the component has mounted on the client.
 * Useful for avoiding hydration mismatches with dynamic content.
 *
 * @example
 * const mounted = useMounted();
 * if (!mounted) return null;
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return mounted;
}
