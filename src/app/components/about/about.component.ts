import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit, AfterViewInit {
  // Counter animation data
  experienceYears: number = 0;
  completedProjects: number = 0;
  companiesWorked: number = 0;
  
  // Final values to animate to
  readonly targetExperience: number = 10;
  readonly targetProjects: number = 50;
  readonly targetCompanies: number = 7;
  
  // Animation duration
  private readonly animationDuration: number = 2000; // 2 seconds
  private readonly animationStep: number = 50; // 50ms per step

  constructor(public languageService: LanguageService) {
    // No need to add translations, as they should be defined in the language service
  }

  ngOnInit(): void {
    // Initialize counters
    this.experienceYears = 0;
    this.completedProjects = 0;
    this.companiesWorked = 0;
  }

  ngAfterViewInit(): void {
    // Delay start of animation to ensure it's visible
    setTimeout(() => {
      this.animateCounter('experienceYears', this.targetExperience);
      this.animateCounter('completedProjects', this.targetProjects);
      this.animateCounter('companiesWorked', this.targetCompanies);
    }, 500);
  }

  /**
   * Animate counter from 0 to target value
   * @param property The property to animate
   * @param target The target value to reach
   */
  private animateCounter(property: 'experienceYears' | 'completedProjects' | 'companiesWorked', target: number): void {
    const steps = this.animationDuration / this.animationStep;
    const increment = target / steps;
    let current = 0;
    
    const interval = setInterval(() => {
      current += increment;
      
      if (current >= target) {
        this[property] = target;
        clearInterval(interval);
      } else {
        this[property] = Math.floor(current);
      }
    }, this.animationStep);
  }
}
