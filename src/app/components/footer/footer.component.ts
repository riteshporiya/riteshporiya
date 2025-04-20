import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ScrollService } from '../../services/scroll.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  constructor(
    private scrollService: ScrollService,
    public languageService: LanguageService
  ) {}

  navigateTo(sectionId: string): void {
    this.scrollService.scrollToSection(sectionId);
  }
}
