import { Component, OnInit, ElementRef, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Snippet } from '../../models/models';

@Component({
    selector: 'app-snippets',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section id="snippets" class="snippets-section">
      <div class="section-container">
        <div class="section-header">
          <span class="section-number">02</span>
          <h2 class="section-title">Code Snippets</h2>
          <div class="section-line"></div>
        </div>
        <div class="snippets-grid">
          <div
            *ngFor="let snippet of snippets; let i = index"
            class="snippet-card"
            #snippetCard
            [class.visible]="visibleCards.has(i)"
          >
            <div class="snippet-header">
              <h3 class="snippet-title">{{ snippet.title }}</h3>
              <span class="snippet-lang">{{ snippet.language }}</span>
            </div>
            <div class="snippet-code">
              <pre><code>{{ snippet.code }}</code></pre>
            </div>
            <p class="snippet-desc" *ngIf="snippet.description">{{ snippet.description }}</p>
          </div>
        </div>
        <div *ngIf="snippets.length === 0" class="empty-state">
          <p>No snippets yet. Check back soon!</p>
        </div>
      </div>
    </section>
  `,
    styles: [`
    .snippets-section {
      padding: 8rem 2rem;
      background: #080808;
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
      background: linear-gradient(90deg, #d4af37, #8b5cf6, transparent);
    }
    .snippets-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem;
    }
    .snippet-card {
      background: #0f0f0f;
      border: 1px solid #1a1a1a;
      overflow: hidden;
      position: relative;
      transition: all 0.4s ease;
      opacity: 0;
      transform: translateY(40px);
    }
    .snippet-card.visible {
      opacity: 1;
      transform: translateY(0);
    }
    .snippet-card::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: linear-gradient(180deg, #d4af37, #3a6ea5, #8b5cf6);
    }
    .snippet-card:hover {
      border-color: #252525;
      box-shadow: 0 15px 35px rgba(0,0,0,0.4);
      transform: translateY(-4px);
    }
    .snippet-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 1.5rem 0;
    }
    .snippet-title {
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      font-size: 1rem;
      color: #fff;
      font-weight: 600;
    }
    .snippet-lang {
      font-family: 'Inter', sans-serif;
      font-size: 0.75rem;
      color: #aaa;
      padding: 0.3rem 0.8rem;
      border: 1px solid #333;
      border-radius: 4px;
      letter-spacing: 1px;
    }
    .snippet-code {
      padding: 1.5rem;
      overflow-x: auto;
    }
    .snippet-code pre {
      margin: 0;
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      font-size: 0.85rem;
      line-height: 1.7;
    }
    .snippet-code code {
      color: #e0e0e0;
      white-space: pre;
    }
    .snippet-desc {
      padding: 0 1.5rem 1.5rem;
      font-family: 'Inter', sans-serif;
      font-size: 0.85rem;
      color: #666;
      line-height: 1.6;
      border-top: 1px solid #1a1a1a;
      padding-top: 1rem;
      margin-top: 0;
    }
    .empty-state {
      text-align: center;
      padding: 4rem;
      color: #666;
      font-family: 'Inter', sans-serif;
    }
    @media (max-width: 768px) {
      .snippets-grid { grid-template-columns: 1fr; }
      .section-title { font-size: 2rem; }
      .section-header { flex-wrap: wrap; }
    }
  `]
})
export class SnippetsComponent implements OnInit, AfterViewInit {
    snippets: Snippet[] = [];
    visibleCards = new Set<number>();

    @ViewChildren('snippetCard') cardElements!: QueryList<ElementRef>;

    constructor(private apiService: ApiService) { }

    ngOnInit() {
        this.apiService.getSnippets().subscribe({
            next: (snippets) => {
                this.snippets = snippets;
                setTimeout(() => this.setupObserver(), 100);
            },
            error: () => {
                this.snippets = [];
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
