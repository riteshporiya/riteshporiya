import { Injectable, Signal, computed, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  private isHeaderScrolled = signal<boolean>(false);
  public headerScrolled: Signal<boolean> = computed(() => this.isHeaderScrolled());

  private showScrollUp = signal<boolean>(false);
  public scrollUpVisible: Signal<boolean> = computed(() => this.showScrollUp());

  private activeSection = signal<string>('home');
  public currentActiveSection: Signal<string> = computed(() => this.activeSection());

  constructor() { }

  /**
   * Initialize scroll event listener
   * Called from AppComponent
   */
  public initScrollListener(): void {
    // Set up the scroll event listener
    window.addEventListener('scroll', () => {
      this.onScroll(window.pageYOffset);
    });
    
    // Initial check of scroll position
    this.onScroll(window.pageYOffset);
  }

  /**
   * Call this method when the scroll event happens
   * @param scrollY - current scroll position
   */
  onScroll(scrollY: number): void {
    // For header background change
    if (scrollY >= 80) {
      this.isHeaderScrolled.set(true);
    } else {
      this.isHeaderScrolled.set(false);
    }

    // For scroll-up button visibility
    if (scrollY >= 560) {
      this.showScrollUp.set(true);
    } else {
      this.showScrollUp.set(false);
    }

    // Update active section based on scroll position
    this.updateActiveSection(scrollY);
  }

  /**
   * Determines which section is currently active based on scroll position
   * @param scrollY - current scroll position
   */
  updateActiveSection(scrollY: number): void {
    // Get all sections with IDs
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach((current) => {
      const htmlElement = current as HTMLElement;
      const sectionHeight = htmlElement.offsetHeight;
      const sectionTop = htmlElement.offsetTop - 50;
      const sectionId = current.getAttribute('id') || '';
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        this.activeSection.set(sectionId);
      }
    });
  }

  /**
   * Directly set the active section (for navigation without scrolling)
   * @param sectionId - ID of the section to set as active
   */
  setActiveSection(sectionId: string): void {
    this.activeSection.set(sectionId);
  }

  /**
   * Scroll to top of the page
   */
  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  /**
   * Scroll to specific section
   * @param sectionId - ID of the section to scroll to
   */
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
