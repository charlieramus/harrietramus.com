import { wordmark } from "@/site.config";

// The quiet footer under every page: the wordmark and the journal's one-line
// descriptor. No links, no columns — it just closes the page.
export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <span className="footer-mark">{wordmark}</span>
      <span className="footer-dot" aria-hidden="true">
        ·
      </span>
      <span className="footer-tag">A journal of places</span>
    </footer>
  );
}
