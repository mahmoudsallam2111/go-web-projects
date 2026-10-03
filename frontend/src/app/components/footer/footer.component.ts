import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [CommonModule],
    template: `
    <footer id="about" class="footer">
      <div class="footer-container">
        <div class="footer-grid">
          <div class="footer-about">
            <h3 class="footer-logo">Your Name</h3>
            <p class="footer-bio">
              A passionate developer and writer who loves crafting elegant solutions
              and sharing knowledge through articles and code. Exploring the intersection
              of technology, design, and human experience.
            </p>
          </div>
          <div class="footer-links">
            <h4>Navigation</h4>
            <ul>
              <li><a (click)="scrollTo('hero')">Home</a></li>
              <li><a (click)="scrollTo('articles')">Articles</a></li>
              <li><a (click)="scrollTo('snippets')">Code</a></li>
            </ul>
          </div>
          <div id="contact" class="footer-contact">
            <h4>Connect</h4>
            <ul>
              <li><a href="mailto:hello&#64;example.com">
                <span class="contact-icon">✉</span> hello&#64;example.com
              </a></li>
              <li><a href="https://github.com" target="_blank">
                <span class="contact-icon">⟁</span> GitHub
              </a></li>
              <li><a href="https://linkedin.com" target="_blank">
                <span class="contact-icon">◈</span> LinkedIn
              </a></li>
              <li><a href="https://twitter.com" target="_blank">
                <span class="contact-icon">✧</span> Twitter / X
              </a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <div class="footer-divider"></div>
          <div class="footer-bottom-content">
            <p>&copy; {{ currentYear }} Your Name. All rights reserved.</p>
            <p class="footer-tagline">Crafted with passion and precision.</p>
          </div>
        </div>
      </div>
    </footer>
  `,
    styles: [`
    .footer {
      padding: 6rem 2rem 3rem;
      background: #0d0d0d;
      border-top: 1px solid #1a1a1a;
    }
    .footer-container {
      max-width: 1400px;
      margin: 0 auto;
    }
    .footer-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 4rem;
      margin-bottom: 4rem;
    }
    .footer-logo {
      font-family: 'Playfair Display', serif;
      font-size: 1.8rem;
      color: #fff;
      margin-bottom: 1rem;
    }
    .footer-bio {
      font-family: 'Inter', sans-serif;
      font-size: 0.95rem;
      color: #666;
      line-height: 1.8;
      max-width: 400px;
    }
    .footer-links h4, .footer-contact h4 {
      font-family: 'Inter', sans-serif;
      font-size: 0.8rem;
      letter-spacing: 2px;
      color: #d4af37;
      margin-bottom: 1.5rem;
      text-transform: uppercase;
    }
    .footer-links ul, .footer-contact ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .footer-links li, .footer-contact li {
      margin-bottom: 0.8rem;
    }
    .footer-links a, .footer-contact a {
      font-family: 'Inter', sans-serif;
      font-size: 0.9rem;
      color: #888;
      text-decoration: none;
      cursor: pointer;
      transition: color 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .footer-links a:hover, .footer-contact a:hover { color: #d4af37; }
    .contact-icon {
      font-size: 1rem;
      color: #d4af37;
    }
    .footer-divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, #333, transparent);
      margin-bottom: 2rem;
    }
    .footer-bottom-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .footer-bottom-content p {
      font-family: 'Inter', sans-serif;
      font-size: 0.8rem;
      color: #555;
    }
    .footer-tagline {
      font-style: italic;
    }
    @media (max-width: 768px) {
      .footer-grid {
        grid-template-columns: 1fr;
        gap: 2.5rem;
      }
      .footer-bottom-content {
        flex-direction: column;
        gap: 0.5rem;
        text-align: center;
      }
    }
  `]
})
export class FooterComponent {
    currentYear = new Date().getFullYear();

    scrollTo(id: string) {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    }
}
