import searchStyles from '@/styles/components/search.css?inline';
import { createRoot } from 'react-dom/client';
import { SEARCH_OPEN_EVENT } from '@/scripts/openSearch';
import SearchModal from '@/components/layout/SearchModal';
let mounted = false;
export function mountSearch() {
  if (mounted) return;
  const host = document.getElementById('search-modal-host');
  if (!host) return;
  // A publication hash may have opened a native dialog while this code loaded.
  window.dispatchEvent(new Event(SEARCH_OPEN_EVENT));
  host.replaceChildren();
  const style = document.createElement('style');
  style.textContent = searchStyles;
  document.head.append(style);
  createRoot(host).render(<SearchModal hideTriggers />);
  mounted = true;
}
