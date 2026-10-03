import { Component, OnInit, ElementRef, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Article } from '../../models/models';

@Component({
    selector: 'app-articles',
    standalone: true,
    imports: [CommonModule, DatePipe],
    template: `
    <section id="articles" class="articles-section">
      <div class="section-container">
        <div class="section-header">
          <span class="section-number">01</span>
          <h2 class="section-title">Latest Articles</h2>
          <div class="section-line"></div>
        </div>
        <div class="articles-grid">
          <article
            *ngFor="let article of articles; let i = index"
            class="article-card"
            #articleCard
            [class.visible]="visibleCards.has(i)"
          >
            <div class="card-accent"></div>
            <div class="card-meta">
              <span class="card-tag" *ngFor="let tag of article.tags?.slice(0, 2)">
                #{{ tag }}
              </span>
              <span class="card-separator">•</span>
              <span class="card-read-time">{{ article.read_time }} min read</span>
              <span class="card-separator">•</span>
              <span class="card-date">{{ article.publish_date | date:'MMM d, yyyy' }}</span>
            </div>
            <h3 class="card-title">{{ article.title }}</h3>
            <p class="card-excerpt">{{ article.excerpt }}</p>
            <a class="card-link">Read More →</a>
          </article>
        </div>
        <div *ngIf="articles.length === 0" class="empty-state">
          <p>No articles yet. Check back soon!</p>
        </div>
      </div>
    </section>
  `,
    styles: [`
    .articles-section {
      padding: 8rem 2rem;
      position: relative;
    }
    .section-container {
      max-width: 1400px;
      margin: 0 auto;
    }
    .section-header {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin-bottom: 4rem;
    }
    .section-number {
      font-family: 'Inter', sans-serif;
      font-size: 0.85rem;
      color: #d4af37;
      font-weight: 500;
    }
    .section-title {
      font-family: 'Playfair Display', serif;
      font-size: 2.8rem;
      font-weight: 700;
      color: #fff;
    }
    .section-line {
      flex: 1;
      height: 1px;
      background: linear-gradient(90deg, #d4af37, #3a6ea5, transparent);
    }
    .articles-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
    }
    .article-card {
      background: #111;
      border: 1px solid #1a1a1a;
      padding: 2rem;
      position: relative;
      overflow: hidden;
      transition: all 0.4s ease;
      opacity: 0;
      transform: translateY(40px);
      cursor: pointer;
    }
    .article-card.visible {
      opacity: 1;
      transform: translateY(0);
    }
    .article-card:hover {
      transform: translateY(-8px);
      border-color: #2a2a2a;
      box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 30px rgba(212, 175, 55, 0.05);
    }
    .card-accent {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #d4af37, #3a6ea5, #8b5cf6);
    }
    .card-meta {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }
    .card-tag {
      font-family: 'Inter', sans-serif;
      font-size: 0.75rem;
      color: #d4af37;
      font-weight: 500;
    }
    .card-separator { color: #444; font-size: 0.7rem; }
    .card-read-time, .card-date {
      font-family: 'Inter', sans-serif;
      font-size: 0.75rem;
      color: #666;
    }
    .card-title {
      font-family: 'Playfair Display', serif;
      font-size: 1.4rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 0.8rem;
      line-height: 1.3;
    }
    .card-excerpt {
      font-family: 'Inter', sans-serif;
      font-size: 0.9rem;
      color: #777;
      line-height: 1.7;
      margin-bottom: 1.5rem;
    }
    .card-link {
      font-family: 'Inter', sans-serif;
      font-size: 0.8rem;
      color: #d4af37;
      text-decoration: none;
      letter-spacing: 1px;
      font-weight: 500;
      transition: color 0.3s ease;
    }
    .card-link:hover { color: #e8c84a; }
    .empty-state {
      text-align: center;
      padding: 4rem;
      color: #666;
      font-family: 'Inter', sans-serif;
    }
    @media (max-width: 768px) {
      .articles-grid { grid-template-columns: 1fr; }
      .section-title { font-size: 2rem; }
      .section-header { flex-wrap: wrap; }
    }
    @media (min-width: 769px) and (max-width: 1024px) {
      .articles-grid { grid-template-columns: repeat(2, 1fr); }
    }
  `]
})
export class ArticlesComponent implements OnInit, AfterViewInit {
    articles: Article[] = [];
    visibleCards = new Set<number>();

    @ViewChildren('articleCard') cardElements!: QueryList<ElementRef>;

    constructor(private apiService: ApiService) { }

    ngOnInit() {
        this.apiService.getArticles().subscribe({
            next: (articles) => {
                this.articles = articles;
                setTimeout(() => this.setupObserver(), 100);
            },
            error: () => {
                this.articles = [];
            }
        });
    }

    ngAfterViewInit() {
        this.setupObserver();
    }

    private setupObserver() {
        if (typeof IntersectionObserver === 'undefined') return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = Array.from(entry.target.parentElement?.children || []).indexOf(entry.target);
                        setTimeout(() => this.visibleCards.add(index), index * 150);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );

        this.cardElements?.forEach((card) => {
            observer.observe(card.nativeElement);
        });
    }
}
