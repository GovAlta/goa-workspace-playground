import { usePageFooterContext } from "../contexts/PageFooterContext";
import { useScrollState } from "../contexts/ScrollStateContext";
import "./PageFooter.css";

/**
 * Sticky page footer component that renders at the bottom of the viewport.
 *
 * Visibility is controlled by the `visibleWhen` option from usePageFooter:
 * - 'always' - always visible when content is set
 * - 'selection' - visible when hasSelection is true (for bulk actions)
 * - 'scrolled' - visible when page has scrolled (for "back to top" etc.)
 * - true/false - explicit visibility control
 */
export function PageFooter() {
  const { content, visibleWhen, hasSelection } = usePageFooterContext();
  const { scrollPosition, isScrollable } = useScrollState();

  if (!content) return null;

  const isVisible =
    visibleWhen === false
      ? false
      : visibleWhen === "selection"
        ? hasSelection
        : visibleWhen === "scrolled"
          ? isScrollable && scrollPosition !== "at-top" && scrollPosition !== "no-scroll"
          : true; // 'always', true, or default

  if (!isVisible) return null;

  const footerClasses = [
    "page-footer",
    isScrollable && scrollPosition
      ? `page-footer--${scrollPosition.replace("-", "")}`
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={footerClasses}>
      <div className="page-footer__content">{content}</div>
    </div>
  );
}
