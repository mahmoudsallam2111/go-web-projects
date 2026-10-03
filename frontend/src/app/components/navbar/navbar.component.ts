import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <nav class="navbar" [class.scrolled]="isScrolled">
      <div class="nav-container">
        <a class="logo" (click)="scrollTo('hero')">Your Name</a>
        <button class="mobile-toggle" (click)="menuOpen = !menuOpen" [class.active]="menuOpen">
          <span></span><span></span><span></span>
        </button>
        <ul class="nav-links" [class.open]="menuOpen">
          <li><a (click)="scrollTo('articles')">ARTICLES</a></li>
          <li><a (click)="scrollTo('snippets')">CODE</a></li>
          <li><a (click)="scrollTo('about')">ABOUT</a></li>
          <li><a (click)="scrollTo('contact')">CONTACT</a></li>
          <li *ngIf="isAuthenticated">
            <a routerLink="/admin" class="admin-link">ADMIN</a>
          </li>
          <li *ngIf="!isAuthenticated">
            <a routerLink="/admin/login" class="admin-link">LOGIN</a>
          </li>
        </ul>
      </div>
    </nav>
  `,
    styles: [`
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      padding: 1.5rem 0;
      transition: all 0.4s ease;
      background: transparent;
    }
    .navbar.scrolled {
      background: rgba(10, 10, 10, 0.95);
      backdrop-filter: blur(20px);
      padding: 1rem 0;
      box-shadow: 0 2px 20px rgba(0,0,0,0.3);
    }
    .nav-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo {
      font-family: 'Playfair Display', serif;
      font-size: 1.5rem;
      font-weight: 700;
      color: #fff;
      cursor: pointer;
      text-decoration: none;
    }
    .nav-links {
      list-style: none;
      display: flex;
      gap: 2.5rem;
      margin: 0;
      padding: 0;
    }
    .nav-links a {
      color: #999;
      text-decoration: none;
      font-family: 'Inter', sans-serif;
      font-size: 0.8rem;
      letter-spacing: 2px;
      font-weight: 500;
      transition: color 0.3s ease;
      cursor: pointer;
    }
    .nav-links a:hover { color: #d4af37; }
    .admin-link { color: #d4af37 !important; }
    .mobile-toggle {
      display: none;
      flex-direction: column;
      gap: 5px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 5px;
    }
    .mobile-toggle span {
      display: block;
      width: 25px;
      height: 2px;
      background: #fff;
      transition: all 0.3s ease;
    }
    .mobile-toggle.active span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
    .mobile-toggle.active span:nth-child(2) { opacity: 0; }
    .mobile-toggle.active span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }
    @media (max-width: 768px) {
      .mobile-toggle { display: flex; }
      .nav-links {
        position: fixed;
        top: 0;
        right: -100%;
        height: 100vh;
        width: 280px;
        background: rgba(15, 15, 15, 0.98);
        flex-direction: column;
        padding: 5rem 2rem 2rem;
        gap: 1.5rem;
        transition: right 0.4s ease;
      }
      .nav-links.open { right: 0; }
      .nav-links a { font-size: 1rem; }
    }
  `]
})
export class NavbarComponent {
    isScrolled = false;
    menuOpen = false;
    isAuthenticated = false;

    constructor(private authService: AuthService) {
        this.authService.isAuthenticated$.subscribe(
            auth => this.isAuthenticated = auth
        );
    }

    @HostListener('window:scroll')
    onScroll() {
        this.isScrolled = window.scrollY > 50;
    }

    scrollTo(id: string) {
        this.menuOpen = false;
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    }
}
