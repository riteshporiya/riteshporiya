import { Component, HostListener, OnInit } from '@angular/core';
import { ThemeService } from './services/theme.service';
import { ScrollService } from './services/scroll.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public isMenuOpen = false;
  public currentYear = new Date().getFullYear();
  
  constructor(
    public themeService: ThemeService,
    public scrollService: ScrollService
  ) {}

  ngOnInit(): void {
    // Initialize theme based on user preference
    this.themeService.initTheme();
    
    // Listen for scroll events
    this.scrollService.initScrollListener();
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    // Pass current scroll position to the scroll service
    this.scrollService.onScroll(window.pageYOffset);
  }
  
  /**
   * Detect if screen is mobile size
   */
  public isMobile(): boolean {
    return window.innerWidth < 1200;
  }
  
  /**
   * Toggle mobile menu
   */
  public toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    
    // Prevent scrolling when menu is open
    if (this.isMenuOpen) {
      document.body.classList.add('no-scroll');
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('no-scroll');
      document.body.classList.remove('menu-open');
    }
    
    console.log('App: Menu toggled to', this.isMenuOpen);
  }
  
  /**
   * Close mobile menu
   */
  public closeMenu(): void {
    if (this.isMenuOpen) {
      this.isMenuOpen = false;
      document.body.classList.remove('no-scroll');
      document.body.classList.remove('menu-open');
      console.log('App: Menu closed');
    }
  }
  
  /**
   * Close menu on resize if window width is large enough
   */
  @HostListener('window:resize')
  public onResize(): void {
    if (window.innerWidth >= 1200 && this.isMenuOpen) {
      this.closeMenu();
    }
  }

  /**
   * Handle the menu toggled event from the header component
   */
  public onMenuToggled(isOpen: boolean): void {
    // Only update if the state is different to prevent infinite loops
    if (this.isMenuOpen !== isOpen) {
      this.isMenuOpen = isOpen;
      
      if (isOpen) {
        document.body.classList.add('no-scroll');
        document.body.classList.add('menu-open');
      } else {
        document.body.classList.remove('no-scroll');
        document.body.classList.remove('menu-open');
      }
      
      console.log('App: Menu state updated from header:', isOpen);
    }
  }
}
