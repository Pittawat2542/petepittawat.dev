type RefreshWindow = Window & {
  __vite_plugin_react_preamble_installed__?: boolean;
  $RefreshReg$?: (...args: unknown[]) => void;
  $RefreshSig$?: () => <T>(type: T) => T;
};

export async function openSearch() {
  if (import.meta.env.DEV) {
    try {
      const refreshWindow = window as RefreshWindow;
      if (!refreshWindow.__vite_plugin_react_preamble_installed__) {
        // @ts-expect-error Vite exposes this module only in development.
        const RefreshRuntime = await import('/@react-refresh');
        RefreshRuntime.injectIntoGlobalHook(window);
        refreshWindow.$RefreshReg$ = () => {};
        refreshWindow.$RefreshSig$ = () => type => type;
        refreshWindow.__vite_plugin_react_preamble_installed__ = true;
      }
    } catch {
      // ignore if not available
    }
  }
  try {
    const { mountSearchModal } = await import('./mountSearchModal.tsx');
    await mountSearchModal();
  } catch (error) {
    console.error('Failed to load search modal chunk', error);
    if (import.meta.env.DEV) {
      // Vite occasionally needs a hard refresh when optimized deps change mid-session
      console.warn(
        'Search modal will reload once dependencies settle. Refresh the page if issues persist.'
      );
    }
  }
}
