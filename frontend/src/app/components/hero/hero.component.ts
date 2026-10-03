import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-hero',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section id="hero" class="hero">
      <div class="hero-bg"></div>
      <div class="hero-content">
        <p class="hero-subtitle fade-in">DEVELOPER & WRITER</p>
        <h1 class="hero-title fade-in delay-1">
          Crafting code and <em>stories</em> that matter
        </h1>
        <p class="hero-desc fade-in delay-2">
          I build elegant solutions and share insights from the intersection
          of technology, design, and human experience.
        </p>
        <div class="hero-cta fade-in delay-3">
          <a class="btn-primary" (click)="scrollTo('articles')">READ ARTICLES</a>
          <a class="btn-outline" (click)="scrollTo('snippets')">VIEW CODE</a>
        </div>
      </div>
    </section>
  `,
    styles: [`
    .hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
      position: relative;
      overflow: hidden;
      padding: 0 2rem;
    }
    .hero-bg {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(ellipse at 20% 50%, rgba(212, 175, 55, 0.06) 0%, transparent 60%),
                  radial-gradient(ellipse at 80% 20%, rgba(100, 100, 150, 0.04) 0%, transparent 50%);
    }
    .hero-content {
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
      position: relative;
      z-index: 1;
    }
    .hero-subtitle {
      font-family: 'Inter', sans-serif;
      font-size: 0.85rem;
      letter-spacing: 4px;
      color: #d4af37;
      font-weight: 500;
      margin-bottom: 1.5rem;
    }
    .hero-title {
      font-family: 'Playfair Display', serif;
      font-size: 4.5rem;
      font-weight: 700;
      color: #fff;
      line-height: 1.15;
      max-width: 700px;
      margin-bottom: 1.5rem;
    }
    .hero-title em {
      font-style: italic;
      color: #d4af37;
    }
    .hero-desc {
      font-family: 'Inter', sans-serif;
      font-size: 1.15rem;
      color: #888;
      line-height: 1.8;
      max-width: 550px;
      margin-bottom: 2.5rem;
    }
    .hero-cta {
      display: flex;
      gap: 1.2rem;
    }
    .btn-primary {
      display: inline-block;
      padding: 1rem 2.2rem;
      background: #d4af37;
      color: #0a0a0a;
      font-family: 'Inter', sans-serif;
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 2px;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .btn-primary:hover {
      background: #e8c84a;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
    }
    .btn-outline {
      display: inline-block;
      padding: 1rem 2.2rem;
      background: transparent;
      color: #ccc;
      font-family: 'Inter', sans-serif;
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 2px;
      text-decoration: none;
      cursor: pointer;
      border: 1px solid #333;
      transition: all 0.3s ease;
    }
    .btn-outline:hover {
      border-color: #d4af37;
      color: #d4af37;
      transform: translateY(-2px);
    }
    .fade-in {
      opacity: 0;
      transform: translateY(30px);
      animation: fadeInUp 0.8s ease forwards;
    }
    .delay-1 { animation-delay: 0.2s; }
    .delay-2 { animation-delay: 0.4s; }
    .delay-3 { animation-delay: 0.6s; }
    @keyframes fadeInUp {
      to { opacity: 1; transform: translateY(0); }
    }
    @media (max-width: 768px) {
      .hero-title { font-size: 2.5rem; }
      .hero-desc { font-size: 1rem; }
      .hero-cta { flex-direction: column; }
      .btn-primary, .btn-outline { text-align: center; }
    }
    @media (min-width: 769px) and (max-width: 1024px) {
      .hero-title { font-size: 3.5rem; }
    }
  `]
})
export class HeroComponent {
    scrollTo(id: string) {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    }
}
