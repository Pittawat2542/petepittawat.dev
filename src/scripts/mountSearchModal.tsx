import React from 'react';
import { createRoot } from 'react-dom/client';
import SearchModal from '../components/SearchModal';

let root: ReturnType<typeof createRoot> | null = null;

export function mountSearchModal() {
  let container = document.getElementById('search-modal-root');
  if (!container) {
    container = document.createElement('div');
    container.id = 'search-modal-root';
    document.body.appendChild(container);
  }
  if (!root) {
    root = createRoot(container);
  }
  const Modal = SearchModal as unknown as React.ComponentType<{ autoOpen?: boolean }>;
  root.render(React.createElement(Modal, { autoOpen: true }));
}
