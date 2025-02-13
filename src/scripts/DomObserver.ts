export default class DomObserver {
  public static observe(callback: () => void): void {
    const config: MutationObserverInit = {
      childList: true,
      subtree: true,
      characterData: true,
    };
    const observer = new MutationObserver(callback);
    observer.observe(document.body, config);
  }
}
