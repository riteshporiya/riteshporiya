import { Component, OnInit, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../services/language.service';

interface PortfolioItem {
  title: string;
  description: string;
  image: string;
  category: string;
  demoLink: string;
  githubLink: string;
  technologies: string[];
}

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit, AfterViewInit {
  // Portfolio data
  portfolioData: PortfolioItem[] = [
    {
      title: 'Banking App UI Design',
      description: 'Responsive web application UI design for modern banking, featuring account management, transaction history, and payment processing.',
      image: '../../../assets/img/portfolio13.jpg',
      category: 'web',
      demoLink: '#',
      githubLink: '#',
      technologies: ['Angular', 'SCSS', 'TypeScript']
    },
    {
      title: 'E-commerce Mobile App',
      description: 'Mobile e-commerce application with product browsing, cart functionality, user authentication, and payment processing.',
      image: '../../../assets/img/portfolio13.jpg',
      category: 'mobile',
      demoLink: '#',
      githubLink: '#',
      technologies: ['React Native', 'Redux', 'Firebase']
    },
    {
      title: 'Portfolio Website',
      description: 'Personal portfolio website with a modern design, featuring project showcases, skills section, and contact form.',
      image: '../../../assets/img/portfolio13.jpg',
      category: 'web',
      demoLink: '#',
      githubLink: '#',
      technologies: ['HTML5', 'CSS3', 'JavaScript']
    },
    {
      title: 'Brand Identity Design',
      description: 'Complete brand identity package including logo design, typography, color palette, and brand guidelines.',
      image: '../../../assets/img/portfolio13.jpg',
      category: 'design',
      demoLink: '#',
      githubLink: '#',
      technologies: ['Figma', 'Illustrator', 'Photoshop']
    },
    {
      title: 'Task Management Dashboard',
      description: 'Web application dashboard for task management with drag-and-drop functionality, task assignments, and progress tracking.',
      image: '../../../assets/img/portfolio13.jpg',
      category: 'web',
      demoLink: '#',
      githubLink: '#',
      technologies: ['Vue.js', 'Vuex', 'Node.js']
    },
    {
      title: 'Food Delivery App',
      description: 'Mobile application for food ordering and delivery with restaurant browsing, order tracking, and payment processing.',
      image: '../../../assets/img/portfolio2.png',
      category: 'mobile',
      demoLink: '#',
      githubLink: '#',
      technologies: ['Flutter', 'Dart', 'Firebase']
    },
    {
      title: 'Business Analytics Dashboard',
      description: 'Responsive dashboard for business analytics with data visualization, reporting tools, and user authentication.',
      image: '../../../assets/img/portfolio3.png',
      category: 'web',
      demoLink: '#',
      githubLink: '#',
      technologies: ['Angular', 'D3.js', 'Express']
    },
    {
      title: 'Product Landing Page',
      description: 'Modern product landing page with responsive design, featuring product details, pricing tables, and call-to-action sections.',
      image: '../../../assets/img/portfolio13.jpg',
      category: 'design',
      demoLink: '#',
      githubLink: '#',
      technologies: ['HTML5', 'CSS3', 'JavaScript']
    }
  ];
  
  // Portfolio state
  filteredPortfolio: PortfolioItem[] = [];
  activeFilter: 'all' | 'web' | 'mobile' | 'design' = 'all';
  displayedItems: PortfolioItem[] = [];
  hasMoreProjects: boolean = false;
  readonly itemsPerPage: number = 6;
  
  // Animation properties
  isVisible: boolean = false;
  activeCard: number | null = null;
  scrollObserver: IntersectionObserver | null = null;
  
  constructor(
    public languageService: LanguageService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.setFilter('all');
    this.setupScrollObserver();
  }
  
  ngAfterViewInit(): void {
    // Trigger animation after component is rendered
    setTimeout(() => {
      this.isVisible = true;
    }, 200);
  }
  
  /**
   * Set up intersection observer to detect when portfolio section is in viewport
   */
  setupScrollObserver(): void {
    this.scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            this.isVisible = true;
          }, 200);
        }
      });
    }, { threshold: 0.1 });
    
    // Observe the portfolio section
    this.scrollObserver.observe(this.elementRef.nativeElement);
  }
  
  /**
   * Handle card hover to activate particles effect
   * @param index The index of the hovered card
   */
  onCardHover(index: number): void {
    this.activeCard = index;
  }

  /**
   * Filter portfolio items by category
   * @param category Category to filter by
   */
  setFilter(category: 'all' | 'web' | 'mobile' | 'design'): void {
    this.activeFilter = category;
    
    if (category === 'all') {
      this.filteredPortfolio = this.portfolioData;
    } else {
      this.filteredPortfolio = this.portfolioData.filter(item => item.category === category);
    }
    
    // Reset animation when changing filter
    this.isVisible = false;
    setTimeout(() => {
      this.isVisible = true;
    }, 100);
    
    // Display first batch of items
    this.loadInitialItems();
  }

  /**
   * Load initial set of portfolio items
   */
  loadInitialItems(): void {
    const endIndex = Math.min(this.itemsPerPage, this.filteredPortfolio.length);
    this.displayedItems = this.filteredPortfolio.slice(0, endIndex);
    this.hasMoreProjects = this.displayedItems.length < this.filteredPortfolio.length;
    
    // Update the filtered portfolio with displayed items
    this.filteredPortfolio = this.displayedItems;
  }

  /**
   * Load more portfolio items when "Load More" button is clicked
   */
  loadMoreProjects(): void {
    const currentLength = this.filteredPortfolio.length;
    const newLength = Math.min(currentLength + this.itemsPerPage, this.portfolioData.length);
    
    // Get new items to display
    const newItems = this.portfolioData.slice(currentLength, newLength);
    
    // Reset animation
    this.isVisible = false;
    
    // Add new items to the displayed items
    setTimeout(() => {
      this.filteredPortfolio = [...this.filteredPortfolio, ...newItems];
      this.hasMoreProjects = this.filteredPortfolio.length < this.portfolioData.length;
      this.isVisible = true;
    }, 100);
  }
}
