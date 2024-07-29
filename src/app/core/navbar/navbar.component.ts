import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, MatCardModule]
})
export class NavbarComponent {
  textLanguage = "en";
  constructor(private translate: TranslateService) {}

  toggleLanguage() {
    const currentLang = this.translate.currentLang;
    const newLang = currentLang === 'pt' ? 'en' : 'pt';
    this.textLanguage = newLang;
    this.translate.use(newLang);
  }
}
