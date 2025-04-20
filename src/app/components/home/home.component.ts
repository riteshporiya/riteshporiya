import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ScrollService } from '../../services/scroll.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  // Typing animation properties
  typingTexts: string[] = ['Full Stack Developer', 'Angular Expert', 'Node.js Developer'];
  currentTypingText: string = '';
  currentTextIndex: number = 0;
  currentCharIndex: number = 0;
  typingSpeed: number = 150; // ms per character
  deletingSpeed: number = 75; // ms per character
  pauseTime: number = 1500; // pause at the end of text
  isDeleting: boolean = false;
  cursorBlink: boolean = true;
  typingInterval: any;

  // Statistics for display
  experienceYears: number = 5;
  completedProjects: number = 20;
  happyClients: number = 10;

  constructor(
    private scrollService: ScrollService,
    public languageService: LanguageService
  ) {}

  ngOnInit(): void {
    // Start typing animation
    this.startTypingAnimation();
    
    // Add animation class to elements after a delay
    setTimeout(() => {
      this.animateElements();
    }, 300);
  }

  ngOnDestroy(): void {
    // Clean up interval when component is destroyed
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
    }
  }

  scrollDown(): void {
    this.scrollService.scrollToSection('about');
  }

  startTypingAnimation(): void {
    const typeNextCharacter = () => {
      const currentText = this.typingTexts[this.currentTextIndex];
      
      if (this.isDeleting) {
        // Delete characters
        this.currentTypingText = currentText.substring(0, this.currentCharIndex - 1);
        this.currentCharIndex--;
        
        // Check if deletion is complete
        if (this.currentCharIndex === 0) {
          this.isDeleting = false;
          this.currentTextIndex = (this.currentTextIndex + 1) % this.typingTexts.length;
          this.cursorBlink = true;
          
          // Pause before typing next text
          setTimeout(() => {
            this.cursorBlink = false;
            if (this.typingInterval) {
              clearInterval(this.typingInterval);
            }
            this.typingInterval = setInterval(typeNextCharacter, this.typingSpeed);
          }, this.pauseTime / 2);
        }
      } else {
        // Type characters
        this.currentTypingText = currentText.substring(0, this.currentCharIndex + 1);
        this.currentCharIndex++;
        
        // Check if typing is complete
        if (this.currentCharIndex === currentText.length) {
          this.cursorBlink = true;
          
          // Pause before deleting
          setTimeout(() => {
            this.isDeleting = true;
            this.cursorBlink = false;
            if (this.typingInterval) {
              clearInterval(this.typingInterval);
            }
            this.typingInterval = setInterval(typeNextCharacter, this.deletingSpeed);
          }, this.pauseTime);
        }
      }
    };

    // Start the typing animation
    this.typingInterval = setInterval(typeNextCharacter, this.typingSpeed);
  }

  // Add animation to elements
  private animateElements(): void {
    // Implementation can be extended with JavaScript animations if needed
    // This is a placeholder for future enhancements
  }
}
