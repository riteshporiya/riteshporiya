import { Component, OnInit, OnDestroy, HostListener, computed, Signal, ElementRef, Renderer2, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { ScrollService } from '../../services/scroll.service';
import { LanguageService } from '../../services/language.service';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { trigger, transition, style, animate, state } from '@angular/animations';

interface NavItem {
  id: string;
  title: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, LanguageSwitcherComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.4s ease-in-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('0.4s ease-in-out', style({ opacity: 0 }))
      ])
    ]),
    trigger('slideInOut', [
      state('void', style({ 
        transform: 'translateX(-20px)',
        opacity: 0
      })),
      state('*', style({ 
        transform: 'translateX(0)',
        opacity: 1
      })),
      transition('void <=> *', animate('0.5s ease'))
    ])
  ]
})
export class HeaderComponent implements OnInit, OnDestroy {
  showMenu: boolean = false;
  showOverlay: boolean = false;
  activeSection = 'home';
  private routeSubscription: Subscription | null = null;
  private scrollPosition: number = 0;
  headerShadow: boolean = false;
  isDarkTheme: Signal<boolean>;
  
  // Output event for menu toggle
  @Output() menuToggled = new EventEmitter<boolean>();
  
  // Track touch start position for swipe detection
  private touchStartX: number = 0;
  private touchEndX: number = 0;

  navItems: NavItem[] = [
    { id: 'home', title: 'Home', path: '/home', icon: 'uil-estate' },
    { id: 'about', title: 'About', path: '/about', icon: 'uil-user' },
    { id: 'skills', title: 'Skills', path: '/skills', icon: 'uil-file-alt' },
    { id: 'portfolio', title: 'Portfolio', path: '/portfolio', icon: 'uil-scenery' },
    { id: 'contact', title: 'Contact', path: '/contact', icon: 'uil-message' }
  ];

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private el: ElementRef,
    public scrollService: ScrollService,
    public themeService: ThemeService,
    public languageService: LanguageService
  ) {
    this.isDarkTheme = computed(() => this.themeService.darkMode());
  }

  /**
   * Initialize the component by watching route changes,
   * setting up the initial active section, adding event listeners
   */
  ngOnInit(): void {
    // Force dark theme for LiCacw design
    if (!this.isDarkTheme()) {
      this.themeService.toggleTheme();
    }
    
    this.renderer.addClass(document.body, 'dark-theme');
    
    this.watchRouteChanges();
    
    // Get the initial active section based on the current route
    const currentRoute = this.router.url.split('/')[1] || 'home';
    this.activeSection = currentRoute;

    // Adjust sidebar based on screen size
    this.adjustSidebarForScreenSize();

    // Add scroll listener for header shadow
    window.addEventListener('scroll', this.scrollFunction);
    
    // Add touch event listeners for swipe detection
    document.addEventListener('touchstart', this.handleTouchStart.bind(this), false);
    document.addEventListener('touchend', this.handleTouchEnd.bind(this), false);
    
    // Add decorative elements to body
    this.addDecorativeElements();
  }

  /**
   * Clean up subscriptions and event listeners when the component is destroyed
   */
  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    window.removeEventListener('scroll', this.scrollFunction);
    document.removeEventListener('touchstart', this.handleTouchStart.bind(this));
    document.removeEventListener('touchend', this.handleTouchEnd.bind(this));
    
    // Remove decorative elements
    const dots = document.querySelectorAll('.dot-decoration');
    dots.forEach(dot => dot.remove());
  }

  /**
   * Add decorative dot elements to the body (like LiCacw design)
   */
  private addDecorativeElements(): void {
    const positions = [
      { size: 'dot-lg', top: '15%', left: '85%' },
      { size: 'dot-md', top: '60%', left: '15%' },
      { size: 'dot-sm', top: '80%', left: '70%' },
      { size: 'dot-md', top: '30%', left: '8%' }
    ];
    
    positions.forEach(pos => {
      const dot = this.renderer.createElement('div');
      this.renderer.addClass(dot, 'dot-decoration');
      this.renderer.addClass(dot, pos.size);
      this.renderer.addClass(dot, 'float');
      this.renderer.setStyle(dot, 'top', pos.top);
      this.renderer.setStyle(dot, 'left', pos.left);
      this.renderer.appendChild(document.body, dot);
    });
  }

  /**
   * Handle touch start event for swipe detection
   */
  private handleTouchStart(e: TouchEvent): void {
    this.touchStartX = e.touches[0].clientX;
  }

  /**
   * Handle touch end event for swipe detection
   * This enables swiping from left edge to open sidebar
   */
  private handleTouchEnd(e: TouchEvent): void {
    this.touchEndX = e.changedTouches[0].clientX;
    this.checkSwipeDirection();
  }

  /**
   * Check swipe direction and open/close menu accordingly
   */
  private checkSwipeDirection(): void {
    const SWIPE_THRESHOLD = 100;
    
    // Right swipe (from left edge)
    if (
      this.touchStartX < 30 && 
      this.touchEndX - this.touchStartX > SWIPE_THRESHOLD && 
      !this.showMenu
    ) {
      this.toggleMenu();
    }
    
    // Left swipe
    if (
      this.touchStartX - this.touchEndX > SWIPE_THRESHOLD && 
      this.showMenu
    ) {
      this.toggleMenu();
    }
  }

  /**
   * Subscribe to router events to update the active section based on navigation
   */
  private watchRouteChanges(): void {
    this.routeSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const route = event.urlAfterRedirects.split('/')[1] || 'home';
      this.activeSection = route;
      
      // Scroll to top on navigation
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Add page transition effect
      this.addPageTransitionEffect();
    });
  }

  /**
   * Add a smooth page transition effect
   */
  private addPageTransitionEffect(): void {
    const mainContent = document.querySelector('main');
    if (mainContent) {
      this.renderer.setStyle(mainContent, 'opacity', '0');
      this.renderer.setStyle(mainContent, 'transform', 'translateY(20px)');
      
      setTimeout(() => {
        this.renderer.setStyle(mainContent, 'opacity', '1');
        this.renderer.setStyle(mainContent, 'transform', 'translateY(0)');
      }, 100);
    }
  }

  /**
   * Scroll function to add shadow to header when scrolling down
   */
  scrollFunction = (): void => {
    this.scrollPosition = window.scrollY;
    this.headerShadow = this.scrollPosition > 50;
  }

  /**
   * Adjust sidebar behavior based on screen size
   */
  private adjustSidebarForScreenSize(): void {
    if (window.innerWidth <= 767) {
      this.showMenu = false;
      this.showOverlay = false;
    } else {
      this.showMenu = true;
      this.showOverlay = false;
    }
  }

  /**
   * Check if we're in mobile view
   */
  isMobileView(): boolean {
    return window.innerWidth <= 1200;
  }

  /**
   * Toggle mobile menu visibility
   */
  toggleMenu(): void {
    this.showMenu = !this.showMenu;
    this.showOverlay = this.showMenu;
    
    // Emit the menu state to parent component
    this.menuToggled.emit(this.showMenu);
    
    // Prevent background scrolling when menu is open
    if (this.showMenu) {
      this.renderer.addClass(document.body, 'no-scroll');
    } else {
      this.renderer.removeClass(document.body, 'no-scroll');
    }
    
    // Add specific body class for open menu state
    if (this.showMenu) {
      this.renderer.addClass(document.body, 'menu-open');
    } else {
      this.renderer.removeClass(document.body, 'menu-open');
    }
    
    // Log menu state (for debugging)
    console.log('Menu toggled:', this.showMenu);
  }

  /**
   * Close the mobile menu
   */
  closeMenu(): void {
    if (this.showMenu) {
      this.showMenu = false;
      this.showOverlay = false;
      
      // Emit the menu state to parent component
      this.menuToggled.emit(false);
      
      // Re-enable scrolling
      this.renderer.removeClass(document.body, 'no-scroll');
      this.renderer.removeClass(document.body, 'menu-open');
      
      // Log menu state (for debugging)
      console.log('Menu closed');
    }
  }

  /**
   * Set the active section and close the menu (mobile)
   */
  setActiveSection(section: string): void {
    this.activeSection = section;
    // Close menu after navigation on mobile
    this.closeMenu();
    
    // Add animation effect to section transition
    this.addPageTransitionEffect();
  }

  /**
   * Toggle the theme between light and dark mode
   */
  toggleTheme(): void {
    this.themeService.toggleTheme();
    
    // Apply transition effect
    const body = document.body;
    this.renderer.addClass(body, 'theme-transition');
    
    setTimeout(() => {
      this.renderer.removeClass(body, 'theme-transition');
    }, 400);
  }
  
  /**
   * Listen for screen resize to handle menu state
   */
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.adjustSidebarForScreenSize();
  }
  
  /**
   * Get animation delay based on index
   * Used for staggered animations
   */
  getAnimationDelay(index: number): string {
    return `${0.1 + (index * 0.05)}s`;
  }
}
