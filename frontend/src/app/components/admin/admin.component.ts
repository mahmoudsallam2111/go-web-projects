import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { Article, Snippet } from '../../models/models';

@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    template: `
    <!-- Login View -->
    <div *ngIf="!isAuthenticated" class="admin-login">
      <div class="login-card">
        <h2>Admin Login</h2>
        <p class="login-subtitle">Sign in to manage your content</p>
        <form (ngSubmit)="login()">
          <div class="form-group">
            <label>Username</label>
            <input type="text" [(ngModel)]="username" name="username" placeholder="Enter username" required>
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" [(ngModel)]="password" name="password" placeholder="Enter password" required>
          </div>
          <div *ngIf="loginError" class="error-msg">{{ loginError }}</div>
          <button type="submit" class="btn-submit">Sign In</button>
        </form>
      </div>
    </div>

    <!-- Admin Dashboard -->
    <div *ngIf="isAuthenticated" class="admin-dashboard">
      <div class="admin-header">
        <div class="admin-header-content">
          <h2>Admin Dashboard</h2>
          <div class="admin-actions">
            <a routerLink="/" class="btn-back">← Back to Site</a>
            <button (click)="logout()" class="btn-logout">Logout</button>
          </div>
        </div>
      </div>

      <div class="admin-content">
        <div class="admin-tabs">
          <button [class.active]="activeTab === 'articles'" (click)="activeTab = 'articles'">
            Articles ({{ articles.length }})
          </button>
          <button [class.active]="activeTab === 'snippets'" (click)="activeTab = 'snippets'">
            Snippets ({{ snippets.length }})
          </button>
        </div>

        <!-- Articles Tab -->
        <div *ngIf="activeTab === 'articles'" class="tab-content">
          <div class="tab-header">
            <h3>Manage Articles</h3>
            <button (click)="showArticleForm = true; editingArticle = null; resetArticleForm()" class="btn-add">
              + New Article
            </button>
          </div>

          <!-- Article Form -->
          <div *ngIf="showArticleForm" class="form-panel">
            <h4>{{ editingArticle ? 'Edit' : 'Create' }} Article</h4>
            <form (ngSubmit)="saveArticle()">
              <div class="form-group">
                <label>Title</label>
                <input type="text" [(ngModel)]="articleForm.title" name="title" required>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Tags (comma separated)</label>
                  <input type="text" [(ngModel)]="articleForm.tagsString" name="tags">
                </div>
                <div class="form-group">
                  <label>Read Time (min)</label>
                  <input type="number" [(ngModel)]="articleForm.read_time" name="readTime">
                </div>
              </div>
              <div class="form-group">
                <label>Excerpt</label>
                <textarea [(ngModel)]="articleForm.excerpt" name="excerpt" rows="2"></textarea>
              </div>
              <div class="form-group">
                <label>Content</label>
                <textarea [(ngModel)]="articleForm.content" name="content" rows="10"></textarea>
              </div>
              <div class="form-actions">
                <button type="submit" class="btn-submit">{{ editingArticle ? 'Update' : 'Create' }}</button>
                <button type="button" (click)="showArticleForm = false" class="btn-cancel">Cancel</button>
              </div>
            </form>
          </div>

          <!-- Articles List -->
          <div class="items-list">
            <div *ngFor="let article of articles" class="item-row">
              <div class="item-info">
                <h4>{{ article.title }}</h4>
                <p>{{ article.excerpt }}</p>
                <div class="item-meta">
                  <span class="tag" *ngFor="let tag of article.tags">{{ tag }}</span>
                  <span>{{ article.read_time }} min</span>
                </div>
              </div>
              <div class="item-actions">
                <button (click)="editArticle(article)" class="btn-edit">Edit</button>
                <button (click)="deleteArticle(article.id)" class="btn-delete">Delete</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Snippets Tab -->
        <div *ngIf="activeTab === 'snippets'" class="tab-content">
          <div class="tab-header">
            <h3>Manage Snippets</h3>
            <button (click)="showSnippetForm = true; editingSnippet = null; resetSnippetForm()" class="btn-add">
              + New Snippet
            </button>
          </div>

          <!-- Snippet Form -->
          <div *ngIf="showSnippetForm" class="form-panel">
            <h4>{{ editingSnippet ? 'Edit' : 'Create' }} Snippet</h4>
            <form (ngSubmit)="saveSnippet()">
              <div class="form-row">
                <div class="form-group">
                  <label>Title</label>
                  <input type="text" [(ngModel)]="snippetForm.title" name="title" required>
                </div>
                <div class="form-group">
                  <label>Language</label>
                  <input type="text" [(ngModel)]="snippetForm.language" name="language" required>
                </div>
              </div>
              <div class="form-group">
                <label>Description</label>
                <textarea [(ngModel)]="snippetForm.description" name="description" rows="2"></textarea>
              </div>
              <div class="form-group">
                <label>Code</label>
                <textarea [(ngModel)]="snippetForm.code" name="code" rows="12" class="code-input"></textarea>
              </div>
              <div class="form-actions">
                <button type="submit" class="btn-submit">{{ editingSnippet ? 'Update' : 'Create' }}</button>
                <button type="button" (click)="showSnippetForm = false" class="btn-cancel">Cancel</button>
              </div>
            </form>
          </div>

          <!-- Snippets List -->
          <div class="items-list">
            <div *ngFor="let snippet of snippets" class="item-row">
              <div class="item-info">
                <h4>{{ snippet.title }}</h4>
                <p>{{ snippet.description }}</p>
                <div class="item-meta">
                  <span class="tag lang-tag">{{ snippet.language }}</span>
                </div>
              </div>
              <div class="item-actions">
                <button (click)="editSnippet(snippet)" class="btn-edit">Edit</button>
                <button (click)="deleteSnippet(snippet.id)" class="btn-delete">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .admin-login {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0a0a0a;
      padding: 2rem;
    }
    .login-card {
      background: #111;
      border: 1px solid #1a1a1a;
      padding: 3rem;
      width: 100%;
      max-width: 420px;
    }
    .login-card h2 {
      font-family: 'Playfair Display', serif;
      font-size: 2rem;
      color: #fff;
      margin-bottom: 0.5rem;
    }
    .login-subtitle {
      font-family: 'Inter', sans-serif;
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 2rem;
    }
    .form-group {
      margin-bottom: 1.2rem;
    }
    .form-group label {
      display: block;
      font-family: 'Inter', sans-serif;
      font-size: 0.8rem;
      color: #888;
      letter-spacing: 1px;
      margin-bottom: 0.5rem;
      text-transform: uppercase;
    }
    .form-group input, .form-group textarea {
      width: 100%;
      padding: 0.8rem 1rem;
      background: #0a0a0a;
      border: 1px solid #222;
      color: #e0e0e0;
      font-family: 'Inter', sans-serif;
      font-size: 0.95rem;
      transition: border-color 0.3s ease;
      box-sizing: border-box;
    }
    .form-group input:focus, .form-group textarea:focus {
      outline: none;
      border-color: #d4af37;
    }
    .code-input {
      font-family: 'JetBrains Mono', 'Fira Code', monospace !important;
      font-size: 0.85rem !important;
    }
    .error-msg {
      color: #ff4444;
      font-family: 'Inter', sans-serif;
      font-size: 0.85rem;
      margin-bottom: 1rem;
    }
    .btn-submit {
      width: 100%;
      padding: 0.9rem;
      background: #d4af37;
      color: #0a0a0a;
      border: none;
      font-family: 'Inter', sans-serif;
      font-size: 0.85rem;
      font-weight: 700;
      letter-spacing: 2px;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .btn-submit:hover {
      background: #e8c84a;
    }
    .admin-dashboard {
      min-height: 100vh;
      background: #0a0a0a;
    }
    .admin-header {
      background: #0f0f0f;
      border-bottom: 1px solid #1a1a1a;
      padding: 1.5rem 2rem;
    }
    .admin-header-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .admin-header h2 {
      font-family: 'Playfair Display', serif;
      color: #fff;
      font-size: 1.5rem;
    }
    .admin-actions {
      display: flex;
      gap: 1rem;
    }
    .btn-back {
      color: #888;
      text-decoration: none;
      font-family: 'Inter', sans-serif;
      font-size: 0.85rem;
      transition: color 0.3s ease;
    }
    .btn-back:hover { color: #d4af37; }
    .btn-logout {
      background: none;
      border: 1px solid #333;
      color: #999;
      padding: 0.5rem 1rem;
      font-family: 'Inter', sans-serif;
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .btn-logout:hover { border-color: #ff4444; color: #ff4444; }
    .admin-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    .admin-tabs {
      display: flex;
      gap: 0;
      margin-bottom: 2rem;
      border-bottom: 1px solid #1a1a1a;
    }
    .admin-tabs button {
      background: none;
      border: none;
      padding: 1rem 2rem;
      color: #666;
      font-family: 'Inter', sans-serif;
      font-size: 0.9rem;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: all 0.3s ease;
    }
    .admin-tabs button.active {
      color: #d4af37;
      border-bottom-color: #d4af37;
    }
    .tab-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    .tab-header h3 {
      font-family: 'Playfair Display', serif;
      color: #fff;
      font-size: 1.3rem;
    }
    .btn-add {
      background: #d4af37;
      color: #0a0a0a;
      border: none;
      padding: 0.7rem 1.5rem;
      font-family: 'Inter', sans-serif;
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 1px;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .btn-add:hover { background: #e8c84a; }
    .form-panel {
      background: #111;
      border: 1px solid #1a1a1a;
      padding: 2rem;
      margin-bottom: 2rem;
    }
    .form-panel h4 {
      font-family: 'Playfair Display', serif;
      color: #fff;
      font-size: 1.2rem;
      margin-bottom: 1.5rem;
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }
    .form-actions .btn-submit { width: auto; padding: 0.8rem 2rem; }
    .btn-cancel {
      background: none;
      border: 1px solid #333;
      color: #888;
      padding: 0.8rem 2rem;
      font-family: 'Inter', sans-serif;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .btn-cancel:hover { border-color: #666; color: #ccc; }
    .items-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .item-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #111;
      border: 1px solid #1a1a1a;
      padding: 1.5rem;
      transition: border-color 0.3s ease;
    }
    .item-row:hover { border-color: #252525; }
    .item-info h4 {
      font-family: 'Playfair Display', serif;
      color: #fff;
      font-size: 1.1rem;
      margin-bottom: 0.3rem;
    }
    .item-info p {
      font-family: 'Inter', sans-serif;
      color: #666;
      font-size: 0.85rem;
      margin-bottom: 0.5rem;
    }
    .item-meta {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }
    .tag {
      font-family: 'Inter', sans-serif;
      font-size: 0.7rem;
      color: #d4af37;
      padding: 0.2rem 0.5rem;
      border: 1px solid rgba(212, 175, 55, 0.3);
      border-radius: 2px;
    }
    .lang-tag { color: #8b5cf6; border-color: rgba(139, 92, 246, 0.3); }
    .item-meta span:not(.tag) {
      font-family: 'Inter', sans-serif;
      font-size: 0.75rem;
      color: #555;
    }
    .item-actions {
      display: flex;
      gap: 0.5rem;
    }
    .btn-edit, .btn-delete {
      background: none;
      border: 1px solid #333;
      color: #888;
      padding: 0.5rem 1rem;
      font-family: 'Inter', sans-serif;
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .btn-edit:hover { border-color: #d4af37; color: #d4af37; }
    .btn-delete:hover { border-color: #ff4444; color: #ff4444; }
    @media (max-width: 768px) {
      .form-row { grid-template-columns: 1fr; }
      .item-row { flex-direction: column; align-items: flex-start; gap: 1rem; }
      .admin-header-content { flex-direction: column; gap: 1rem; }
    }
  `]
})
export class AdminComponent implements OnInit {
    isAuthenticated = false;
    username = '';
    password = '';
    loginError = '';
    activeTab = 'articles';

    articles: Article[] = [];
    snippets: Snippet[] = [];

    showArticleForm = false;
    showSnippetForm = false;
    editingArticle: Article | null = null;
    editingSnippet: Snippet | null = null;

    articleForm = { title: '', content: '', excerpt: '', tagsString: '', read_time: 5 };
    snippetForm = { title: '', code: '', language: '', description: '' };

    constructor(
        private authService: AuthService,
        private apiService: ApiService,
        private router: Router
    ) { }

    ngOnInit() {
        this.isAuthenticated = this.authService.isAuthenticated();
        if (this.isAuthenticated) {
            this.loadData();
        }
    }

    login() {
        this.loginError = '';
        this.authService.login({ username: this.username, password: this.password }).subscribe({
            next: () => {
                this.isAuthenticated = true;
                this.loadData();
            },
            error: () => {
                this.loginError = 'Invalid username or password';
            }
        });
    }

    logout() {
        this.authService.logout();
        this.isAuthenticated = false;
        this.router.navigate(['/']);
    }

    loadData() {
        this.apiService.getArticles().subscribe(a => this.articles = a);
        this.apiService.getSnippets().subscribe(s => this.snippets = s);
    }

    resetArticleForm() {
        this.articleForm = { title: '', content: '', excerpt: '', tagsString: '', read_time: 5 };
    }

    resetSnippetForm() {
        this.snippetForm = { title: '', code: '', language: '', description: '' };
    }

    editArticle(article: Article) {
        this.editingArticle = article;
        this.articleForm = {
            title: article.title,
            content: article.content,
            excerpt: article.excerpt,
            tagsString: article.tags?.join(', ') || '',
            read_time: article.read_time
        };
        this.showArticleForm = true;
    }

    saveArticle() {
        const data = {
            title: this.articleForm.title,
            content: this.articleForm.content,
            excerpt: this.articleForm.excerpt,
            tags: this.articleForm.tagsString.split(',').map(t => t.trim()).filter(t => t),
            read_time: this.articleForm.read_time
        };

        const obs = this.editingArticle
            ? this.apiService.updateArticle(this.editingArticle.id, data)
            : this.apiService.createArticle(data);

        obs.subscribe({
            next: () => {
                this.showArticleForm = false;
                this.loadData();
            }
        });
    }

    deleteArticle(id: number) {
        if (confirm('Are you sure you want to delete this article?')) {
            this.apiService.deleteArticle(id).subscribe(() => this.loadData());
        }
    }

    editSnippet(snippet: Snippet) {
        this.editingSnippet = snippet;
        this.snippetForm = {
            title: snippet.title,
            code: snippet.code,
            language: snippet.language,
            description: snippet.description
        };
        this.showSnippetForm = true;
    }

    saveSnippet() {
        const obs = this.editingSnippet
            ? this.apiService.updateSnippet(this.editingSnippet.id, this.snippetForm)
            : this.apiService.createSnippet(this.snippetForm);

        obs.subscribe({
            next: () => {
                this.showSnippetForm = false;
                this.loadData();
            }
        });
    }

    deleteSnippet(id: number) {
        if (confirm('Are you sure you want to delete this snippet?')) {
            this.apiService.deleteSnippet(id).subscribe(() => this.loadData());
        }
    }
}
