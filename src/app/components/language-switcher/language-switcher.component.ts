import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Language, LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss']
})
export class LanguageSwitcherComponent {
  showLanguageDropdown = false;

  constructor(public languageService: LanguageService) {}

  toggleDropdown(): void {
    this.showLanguageDropdown = !this.showLanguageDropdown;
  }

  changeLanguage(language: Language): void {
    this.languageService.setLanguage(language.code);
    this.showLanguageDropdown = false;
  }

  getCurrentFlag(): string {
    return this.languageService.getCurrentLanguage().flag;
  }

  getCurrentLanguageName(): string {
    return this.languageService.getCurrentLanguage().name;
  }
}
