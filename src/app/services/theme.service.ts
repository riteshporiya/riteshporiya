import { Injectable, Signal, computed, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY_THEME = 'selected-theme';
  private readonly STORAGE_KEY_ICON = 'selected-icon';
  private readonly DARK_THEME_CLASS = 'dark-theme';
  private readonly ICON_THEME_CLASS = 'uil-sun';

  // Use signals for reactive state management
  private isDarkMode = signal<boolean>(false);
  public darkMode: Signal<boolean> = computed(() => this.isDarkMode());
  private currentIconClass = signal<string>('uil-moon');
  public iconClass: Signal<string> = computed(() => this.currentIconClass());

  // Theme subject for components that use observables
  private themeSubject = new BehaviorSubject<string>('dark');
  public theme$: Observable<string> = this.themeSubject.asObservable();

  constructor() {
    // Initialize theme on service instantiation
  }

  /**
   * Initialize theme based on user preferences or saved settings
   * Called from AppComponent
   */
  public initTheme(): void {
    this.initializeTheme();
  }

  private initializeTheme(): void {
    const selectedTheme = localStorage.getItem(this.STORAGE_KEY_THEME);
    const selectedIcon = localStorage.getItem(this.STORAGE_KEY_ICON);

    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const defaultDarkMode = selectedTheme === 'dark' || (selectedTheme === null && prefersDarkScheme);

    if (defaultDarkMode) {
      this.applyDarkTheme();
    } else {
      this.applyLightTheme();
    }

    // Update theme subject
    this.themeSubject.next(defaultDarkMode ? 'dark' : 'light');

    if (selectedIcon === 'uil-sun' || defaultDarkMode) {
      this.currentIconClass.set('uil-sun');
    }
  }

  toggleTheme(): void {
    // Add transition class to body for smooth transition before changing theme
    document.body.classList.add('theme-transition');
    document.documentElement.classList.add('theme-transition');
    
    // Update signals
    const newDarkMode = !this.isDarkMode();
    this.isDarkMode.set(newDarkMode);
    
    // Toggle icon class
    const newIconClass = newDarkMode ? 'uil-sun' : 'uil-moon';
    this.currentIconClass.set(newIconClass);

    // Update theme subject
    this.themeSubject.next(newDarkMode ? 'dark' : 'light');
    
    // Apply theme based on mode
    if (newDarkMode) {
      this.applyDarkTheme();
    } else {
      this.applyLightTheme();
    }
    
    // Remove transition class after animation completes
    setTimeout(() => {
      document.body.classList.remove('theme-transition');
      document.documentElement.classList.remove('theme-transition');
    }, 1000);
    
    // Save to local storage
    localStorage.setItem(this.STORAGE_KEY_THEME, newDarkMode ? 'dark' : 'light');
    localStorage.setItem(this.STORAGE_KEY_ICON, newIconClass);
  }

  private applyDarkTheme(): void {
    document.body.classList.add(this.DARK_THEME_CLASS);
    document.documentElement.setAttribute('data-bs-theme', 'dark');
    document.documentElement.classList.add(this.DARK_THEME_CLASS);
    this.isDarkMode.set(true);
  }
  
  private applyLightTheme(): void {
    document.body.classList.remove(this.DARK_THEME_CLASS);
    document.documentElement.setAttribute('data-bs-theme', 'light');
    document.documentElement.classList.remove(this.DARK_THEME_CLASS);
    this.isDarkMode.set(false);
    
    // Trigger a small reflow for better animation when switching to light theme
    setTimeout(() => {
      document.body.style.transition = 'none';
      document.body.offsetHeight; // Force reflow
      document.body.style.transition = '';
    }, 50);
  }

  // This is now obsolete as we're using CSS variables with the data-bs-theme attribute
  private applyThemeVariables(isDark: boolean): void {
    // No longer needed as CSS variables are set based on data-bs-theme
    // CSS variables are now defined in styles.scss
  }
}
