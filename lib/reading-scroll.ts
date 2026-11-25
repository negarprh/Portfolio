/** Normally every spread fits. Preserve access if enlarged/injected content
 * still exceeds the fixed paper instead of interpreting reading as navigation.
 */
export function readingSurface(target: EventTarget | null) {
  return target instanceof Element
    ? target.closest<HTMLElement>(".book-fixed-page")
    : null;
}

export function canReadFurther(page: HTMLElement | null, delta: number) {
  if (!page || page.scrollHeight <= page.clientHeight + 1) return false;
  return delta > 0
    ? page.scrollTop + page.clientHeight < page.scrollHeight - 1
    : page.scrollTop > 1;
}
