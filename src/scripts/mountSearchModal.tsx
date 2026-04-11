import SearchModal from '@/components/layout/SearchModal';
import type * as ReactDomClient from 'react-dom/client';

type CreateRootFn = typeof ReactDomClient.createRoot;
type RootContainer = ReturnType<CreateRootFn>;

let createRootFn: CreateRootFn | null = null;
let root: RootContainer | null = null;
let seq = 0;

export async function mountSearchModal() {
  if (!createRootFn) {
    const mod = await import('react-dom/client');
    createRootFn = mod.createRoot;
  }
  let container = document.getElementById('search-modal-root');
  if (!container) {
    container = document.createElement('div');
    container.id = 'search-modal-root';
    document.body.appendChild(container);
  }
  if (!root) {
    root = createRootFn!(container);
  }
  seq += 1;
  root.render(<SearchModal hideTriggers autoOpen openKey={seq} />);
}
