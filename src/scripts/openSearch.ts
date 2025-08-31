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
  const m = await import('./mountSearchModal.tsx');
  m.mountSearchModal();
}
