/**
 * useKeyboardShortcut - Responsible for keyboard shortcut handling
 * Follows Single Responsibility Principle (SRP)
 */

import { useEffect } from 'react';

export function useKeyboardShortcut(
  key: string,
  onTrigger: () => void,
  modifiers?: {
    ctrl?: boolean;
    meta?: boolean;
    shift?: boolean;
    alt?: boolean;
  }
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const matchesKey = event.key.toLowerCase() === key.toLowerCase();
      const matchesShift = modifiers?.shift ? event.shiftKey : !event.shiftKey;
      const matchesAlt = modifiers?.alt ? event.altKey : !event.altKey;

      // For Ctrl/Meta, we want either to match if specified
      const matchesCtrlOrMeta =
        modifiers?.ctrl || modifiers?.meta ? event.ctrlKey || event.metaKey : true;

      if (matchesKey && matchesCtrlOrMeta && matchesShift && matchesAlt) {
        event.preventDefault();
        onTrigger();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, onTrigger, modifiers]);
}
