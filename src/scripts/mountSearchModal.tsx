import { createRoot } from 'react-dom/client';
import SearchModal from '../components/SearchModal';

let root: ReturnType<typeof createRoot> | null = null;
let seq = 0;

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
  seq += 1;
  root.render(<SearchModal hideTriggers autoOpen openKey={seq} />);
}
