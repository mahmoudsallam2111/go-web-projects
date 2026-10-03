import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { HeroComponent } from '../hero/hero.component';
import { ArticlesComponent } from '../articles/articles.component';
import { SnippetsComponent } from '../snippets/snippets.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, NavbarComponent, HeroComponent, ArticlesComponent, SnippetsComponent, FooterComponent],
    template: `
    <app-navbar></app-navbar>
    <app-hero></app-hero>
    <app-articles></app-articles>
    <app-snippets></app-snippets>
    <app-footer></app-footer>
  `
})
export class HomeComponent { }
