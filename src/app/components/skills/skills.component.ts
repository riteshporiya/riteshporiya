import { Component, OnInit, OnDestroy, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../services/language.service';

interface Skill {
  name: string;
  level: number;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit, OnDestroy {
  // Active tab state
  activeTab: 'top' | 'frontend' | 'backend' | 'other' = 'top';
  
  // Animation control properties
  isInViewport = false;
  activeParticlesCard: number | null = null;
  scrollObserver: IntersectionObserver | null = null;
  
  // Skills data arrays
  topSkills: Skill[] = [
    { 
      name: 'HTML', 
      level: 90, 
      icon: 'uil uil-html5', 
      description: 'Expert in semantic HTML5 markup and accessibility best practices.'
    },
    { 
      name: 'CSS', 
      level: 85, 
      icon: 'uil uil-css3-simple', 
      description: 'Advanced CSS3 techniques including animations, Flexbox and Grid layouts.'
    },
    { 
      name: 'JavaScript', 
      level: 90, 
      icon: 'uil uil-java-script', 
      description: 'Proficient in modern ES6+ features and DOM manipulation.'
    },
    { 
      name: 'Angular', 
      level: 85, 
      icon: 'uil uil-angular', 
      description: 'Experience with Angular framework including RxJS and state management.'
    },
    { 
      name: 'React', 
      level: 80, 
      icon: 'uil uil-react', 
      description: 'Building interactive interfaces with React hooks and context API.'
    },
    { 
      name: 'TypeScript', 
      level: 85, 
      icon: 'uil uil-brackets-curly', 
      description: 'Strong typing and object-oriented programming concepts.'
    }
  ];
  
  frontendSkills: Skill[] = [
    { 
      name: 'HTML5', 
      level: 90, 
      icon: 'uil uil-html5', 
      description: 'Semantic markup, accessibility, and best practices.'
    },
    { 
      name: 'CSS3', 
      level: 85, 
      icon: 'uil uil-css3-simple', 
      description: 'Modern layouts, animations, and responsive design.'
    },
    { 
      name: 'SASS/SCSS', 
      level: 80, 
      icon: 'uil uil-brackets-curly', 
      description: 'CSS preprocessing for maintainable style architecture.'
    },
    { 
      name: 'JavaScript', 
      level: 90, 
      icon: 'uil uil-java-script', 
      description: 'ES6+, async programming, and browser APIs.'
    },
    { 
      name: 'Angular', 
      level: 85, 
      icon: 'uil uil-angular', 
      description: 'Component architecture, services, and observables.'
    },
    { 
      name: 'React', 
      level: 80, 
      icon: 'uil uil-react', 
      description: 'Hooks, context API, and component patterns.'
    },
    { 
      name: 'Redux', 
      level: 75, 
      icon: 'uil uil-arrow-growth', 
      description: 'State management for complex applications.'
    },
    { 
      name: 'Bootstrap', 
      level: 85, 
      icon: 'uil uil-window', 
      description: 'Rapid UI development with Bootstrap framework.'
    }
  ];
  
  backendSkills: Skill[] = [
    { 
      name: 'Node.js', 
      level: 80, 
      icon: 'uil uil-server-network', 
      description: 'Server-side JavaScript runtime for scalable applications.'
    },
    { 
      name: 'Express', 
      level: 85, 
      icon: 'uil uil-server', 
      description: 'Web framework for building RESTful APIs and services.'
    },
    { 
      name: 'NestJS', 
      level: 80, 
      icon: 'uil uil-server', 
      description: 'NestJS is a framework for building efficient, scalable Node.js server-side applications.'
    },
    { 
      name: 'MongoDB', 
      level: 70, 
      icon: 'uil uil-database', 
      description: 'NoSQL database for flexible data storage solutions.'
    },
    { 
      name: 'SQL', 
      level: 75, 
      icon: 'uil uil-database', 
      description: 'Relational database design and query optimization.'
    },
    { 
      name: 'PostgreSQL', 
      level: 75, 
      icon: 'uil uil-database', 
      description: 'PostgreSQL is a powerful, open-source object-relational database system.'
    },
    { 
      name: 'Firebase', 
      level: 70, 
      icon: 'uil uil-fire', 
      description: 'Real-time database and authentication services.'
    },
    { 
      name: 'REST API', 
      level: 85, 
      icon: 'uil uil-cloud-data-connection', 
      description: 'Designing and implementing RESTful architecture.'
    }
  ];
  
  otherSkills: Skill[] = [
    { 
      name: 'Git', 
      level: 85, 
      icon: 'uil uil-github', 
      description: 'Version control and collaboration workflows.'
    },
    { 
      name: 'Webpack', 
      level: 75, 
      icon: 'uil uil-package', 
      description: 'Module bundling and asset optimization.'
    },
    { 
      name: 'Jest', 
      level: 70, 
      icon: 'uil uil-check-circle', 
      description: 'Unit testing and test-driven development.'
    },
    { 
      name: 'Docker', 
      level: 65, 
      icon: 'uil uil-docker', 
      description: 'Containerization for consistent deployment environments.'
    },
    { 
      name: 'AWS', 
      level: 60, 
      icon: 'uil uil-cloud', 
      description: 'Cloud services for scalable application hosting.'
    },
    { 
      name: 'Figma', 
      level: 70, 
      icon: 'uil uil-pen', 
      description: 'UI design and prototyping for web applications.'
    }
  ];

  constructor(
    public languageService: LanguageService,
    private elementRef: ElementRef
  ) {}
  
  ngOnInit(): void {
    // Set up intersection observer for reveal animations
    this.setupScrollObserver();
  }
  
  ngOnDestroy(): void {
    // Clean up observer
    if (this.scrollObserver) {
      this.scrollObserver.disconnect();
    }
  }
  
  /**
   * Set up intersection observer to detect when skills section is in viewport
   * to trigger animations
   */
  setupScrollObserver(): void {
    this.scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            this.isInViewport = true;
          }, 200);
        }
      });
    }, { threshold: 0.1 });
    
    // Observe the skills section
    this.scrollObserver.observe(this.elementRef.nativeElement);
  }
  
  /**
   * Handle card hover to activate particles effect
   * @param index The index of the hovered card
   */
  onCardHover(index: number): void {
    this.activeParticlesCard = index;
  }
  
  /**
   * Switch between different skill tabs
   */
  switchTab(tab: 'top' | 'frontend' | 'backend' | 'other'): void {
    this.activeTab = tab;
    // Reset animation when switching tabs
    this.isInViewport = false;
    
    // Re-trigger animations after a short delay
    setTimeout(() => {
      this.isInViewport = true;
    }, 100);
  }
  
  /**
   * Calculate the stroke dash offset for the SVG circle progress
   * @param value The percentage value (0-100)
   * @returns The calculated stroke dash offset
   */
  calculateStrokeDashoffset(value: number): number {
    const circumference = 2 * Math.PI * 45; // 2πr where r is 45
    return circumference - (value / 100) * circumference;
  }
}
