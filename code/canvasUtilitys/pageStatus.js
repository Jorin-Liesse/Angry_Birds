export class PageStatus {
  static pageVisibility = true;
  static pageFocus = true;

  static wasHidden = false;

  static init() {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.pageVisibility = true;
      } else {
        this.pageVisibility = false;
        this.wasHidden = true;
      }
    });
    window.addEventListener('focus', () => {
      this.pageFocus = false
      this.wasHidden = true;
    });

    window.addEventListener('blur', () => {
      this.pageFocus = false
      this.wasHidden = true;
    });
  }
}
