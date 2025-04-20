import { Injectable, Signal, computed, signal } from '@angular/core';

export interface Translation {
  [key: string]: string;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly STORAGE_KEY_LANG = 'selected-language';
  
  // Available languages
  readonly availableLanguages: Language[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' }
  ];

  // Current language
  private currentLanguage = signal<string>('en');
  public language: Signal<string> = computed(() => this.currentLanguage());

  // Translations
  private translations: Record<string, Translation> = {
    en: {
      // Header
      'nav.home': 'Home',
      'nav.about': 'About',
      'nav.skills': 'Skills',
      'nav.portfolio': 'Portfolio',
      'nav.contact': 'Contact',
      
      // Home
      'home.greeting': 'Hi, I\'am Ritesh Poriya',
      'home.subtitle': 'Full Stack Developer',
      'home.description': 'Bringing Web solutions to life with creativity, technical excellence, and attention to detail, ensuring security, scalability, and maintainability.',
      'home.contact': 'Contact Me',
      'home.scroll': 'Scroll down',
      
      // About
      'about.title': 'About Me',
      'about.subtitle': 'Experienced Web Developer 🚀 | JavaScript, Node.js, Angular, GraphQL | Database Enthusiast 📊 | Passionate about Problem Solving 🔍💡',
      'about.description': 'Full-Stack Developer with extensive knowledge and years of experience, working in various UI frameworks, Node.js, web technologies, delivering quality work.',
      'about.experience': 'Years experience',
      'about.completed': 'Completed products',
      'about.projects': 'Completed projects',
      'about.download': 'Download CV',
      'about.name': 'Ritesh Poriya',
      'about.role': 'Full Stack Developer',
      'about.location': 'Surat, Gujarat, India',
      'about.email': 'riteshporiya124@gmail.com',
      'about.phone': '+31-644196203',
      'about.message': 'Message',
      'about.send': 'Send', 
      'about.clients': 'Clients',
      
      // Skills
      'skills.title': 'Skills',
      'skills.subtitle': 'My technical level',
      'skills.topSkills': 'Top Skills',
      'skills.highly': 'Highly Experienced',
      'skills.otherSkills': 'Other Skills',
      'skills.experienced': 'Experienced',
      'skills.frontendDev': 'Frontend Development',
      'skills.backendDev': 'Backend Development',
      'skills.other': 'Other',
      
      // Portfolio
      'portfolio.title': 'Portfolio',
      'portfolio.subtitle': 'My recent work',
      'portfolio.demo': 'Demo',
      'portfolio.github': 'GitHub',
      'portfolio.showMore': 'Show More',
      'portfolio.allProjects': 'All Projects',
      'portfolio.webProjects': 'Web Projects',
      'portfolio.mobileProjects': 'Mobile Projects',
      'portfolio.designProjects': 'Design Projects',
      'portfolio.otherProjects': 'Other Projects',
      
      // Contact
      'contact.title': 'Contact Me',
      'contact.subtitle': 'Get in touch',
      'contact.getInTouch': 'Get in touch',
      'contact.location': 'Location',
      'contact.email': 'Email',
      'contact.phone': 'Phone',
      'contact.message': 'Message',
      'contact.send': 'Send',
      
      // Footer
      'footer.rights': 'All rights reserved'
    },
    es: {
      // Header
      'nav.home': 'Inicio',
      'nav.about': 'Sobre mí',
      'nav.skills': 'Habilidades',
      'nav.portfolio': 'Portafolio',
      'nav.contact': 'Contacto',
      
      // Home
      'home.greeting': 'Hola, soy Ritesh Poriya',
      'home.subtitle': 'Desarrolladora Full Stack',
      'home.description': 'Dando vida a soluciones web con creatividad, excelencia técnica y atención al detalle, garantizando seguridad, escalabilidad y mantenibilidad.',
      'home.contact': 'Contáctame',
      'home.scroll': 'Desplázate hacia abajo',
      
      // About
      'about.title': 'Sobre Mí',
      'about.subtitle': 'Mi introducción',
      'about.description': 'Desarrolladora Full-Stack con amplio conocimiento y años de experiencia, trabajando en varios frameworks de UI, Node.js, tecnologías web, entregando trabajo de calidad.',
      'about.experience': 'Años de experiencia',
      'about.completed': 'Productos completados',
      'about.projects': 'Proyectos completados',
      'about.download': 'Descargar CV',
      
      // Skills
      'skills.title': 'Habilidades',
      'skills.subtitle': 'Mi nivel técnico',
      'skills.topSkills': 'Principales Habilidades',
      'skills.highly': 'Altamente Experimentada',
      'skills.otherSkills': 'Otras Habilidades',
      'skills.experienced': 'Experimentada',
      
      // Portfolio
      'portfolio.title': 'Portafolio',
      'portfolio.subtitle': 'Mi trabajo reciente',
      'portfolio.demo': 'Demo',
      
      // Contact
      'contact.title': 'Contáctame',
      'contact.subtitle': 'Ponte en contacto',
      'contact.getInTouch': 'Ponte en contacto',
      'contact.location': 'Ubicación',
      'contact.email': 'Correo',
      'contact.phone': 'Teléfono',
      'contact.message': 'Mensaje',
      'contact.send': 'Enviar',
      
      // Footer
      'footer.rights': 'Todos los derechos reservados'
    },
    fr: {
      // Header
      'nav.home': 'Accueil',
      'nav.about': 'À propos',
      'nav.skills': 'Compétences',
      'nav.portfolio': 'Portfolio',
      'nav.contact': 'Contact',
      
      // Home
      'home.greeting': 'Bonjour, je suis Ritesh Poriya',
      'home.subtitle': 'Développeuse Full Stack',
      'home.description': 'Donnant vie à des solutions web avec créativité, excellence technique et attention aux détails, assurant sécurité, évolutivité et maintenabilité.',
      'home.contact': 'Contactez-moi',
      'home.scroll': 'Défiler vers le bas',
      
      // About
      'about.title': 'À Propos de Moi',
      'about.subtitle': 'Mon introduction',
      'about.description': 'Développeuse Full-Stack avec une vaste connaissance et des années d\'expérience, travaillant sur divers frameworks UI, Node.js, technologies web, livrant un travail de qualité.',
      'about.experience': 'Années d\'expérience',
      'about.completed': 'Produits complétés',
      'about.projects': 'Projets complétés',
      'about.download': 'Télécharger CV',
      
      // Skills
      'skills.title': 'Compétences',
      'skills.subtitle': 'Mon niveau technique',
      'skills.topSkills': 'Compétences Principales',
      'skills.highly': 'Hautement Expérimentée',
      'skills.otherSkills': 'Autres Compétences',
      'skills.experienced': 'Expérimentée',
      
      // Portfolio
      'portfolio.title': 'Portfolio',
      'portfolio.subtitle': 'Mes travaux récents',
      'portfolio.demo': 'Démo',
      
      // Contact
      'contact.title': 'Contactez-moi',
      'contact.subtitle': 'Entrez en contact',
      'contact.getInTouch': 'Entrez en contact',
      'contact.location': 'Emplacement',
      'contact.email': 'Email',
      'contact.phone': 'Téléphone',
      'contact.message': 'Message',
      'contact.send': 'Envoyer',
      
      // Footer
      'footer.rights': 'Tous droits réservés'
    }
  };

  constructor() {
    this.initializeLanguage();
  }

  private initializeLanguage(): void {
    const savedLanguage = localStorage.getItem(this.STORAGE_KEY_LANG);
    if (savedLanguage && this.isValidLanguage(savedLanguage)) {
      this.currentLanguage.set(savedLanguage);
    }
  }

  private isValidLanguage(lang: string): boolean {
    return this.availableLanguages.some(l => l.code === lang);
  }

  setLanguage(lang: string): void {
    if (this.isValidLanguage(lang)) {
      this.currentLanguage.set(lang);
      localStorage.setItem(this.STORAGE_KEY_LANG, lang);
    }
  }

  // Get translation for a key in the current language
  translate(key: string): string {
    const lang = this.currentLanguage();
    return this.translations[lang]?.[key] || this.translations['en'][key] || key;
  }

  // Get current language object
  getCurrentLanguage(): Language {
    const code = this.currentLanguage();
    return this.availableLanguages.find(l => l.code === code) || this.availableLanguages[0];
  }
}
