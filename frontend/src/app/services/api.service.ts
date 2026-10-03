import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Article, Snippet } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ApiService {
    private baseUrl = 'http://localhost:8080/api';

    constructor(private http: HttpClient) { }

    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        });
    }

    // Articles
    getArticles(): Observable<Article[]> {
        return this.http.get<Article[]>(`${this.baseUrl}/articles`);
    }

    getArticle(id: number): Observable<Article> {
        return this.http.get<Article>(`${this.baseUrl}/articles/${id}`);
    }

    createArticle(article: Partial<Article>): Observable<Article> {
        return this.http.post<Article>(`${this.baseUrl}/articles`, article, {
            headers: this.getAuthHeaders()
        });
    }

    updateArticle(id: number, article: Partial<Article>): Observable<Article> {
        return this.http.put<Article>(`${this.baseUrl}/articles/${id}`, article, {
            headers: this.getAuthHeaders()
        });
    }

    deleteArticle(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/articles/${id}`, {
            headers: this.getAuthHeaders()
        });
    }

    // Snippets
    getSnippets(): Observable<Snippet[]> {
        return this.http.get<Snippet[]>(`${this.baseUrl}/snippets`);
    }

    getSnippet(id: number): Observable<Snippet> {
        return this.http.get<Snippet>(`${this.baseUrl}/snippets/${id}`);
    }

    createSnippet(snippet: Partial<Snippet>): Observable<Snippet> {
        return this.http.post<Snippet>(`${this.baseUrl}/snippets`, snippet, {
            headers: this.getAuthHeaders()
        });
    }

    updateSnippet(id: number, snippet: Partial<Snippet>): Observable<Snippet> {
        return this.http.put<Snippet>(`${this.baseUrl}/snippets/${id}`, snippet, {
            headers: this.getAuthHeaders()
        });
    }

    deleteSnippet(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/snippets/${id}`, {
            headers: this.getAuthHeaders()
        });
    }
}
