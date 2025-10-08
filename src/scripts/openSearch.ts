export async function openSearch() {
  if (import.meta.env.DEV) {
    try {
      // Ensure React Fast Refresh preamble exists in dev to avoid plugin error
      // @vitejs/plugin-react expects this to be installed before any React module executes
      // @ts-ignore
      if (!window.__vite_plugin_react_preamble_installed__) {
        // @ts-ignore
        const RefreshRuntime = await import('/@react-refresh');
        // @ts-ignore
        RefreshRuntime.injectIntoGlobalHook(window);
        // @ts-ignore
        window.$RefreshReg$ = () => {};
        // @ts-ignore
        window.$RefreshSig$ = () => (type: any) => type;
        // @ts-ignore
        window.__vite_plugin_react_preamble_installed__ = true;
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
      console.info(
        'Search modal will reload once dependencies settle. Refresh the page if issues persist.'
      );
    }
  }
}
