import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NavbarComponent } from './core/navbar/navbar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterModule, NavbarComponent]
})
export class AppComponent {
  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('pt');
    this.translate.use('pt');
  }

  toggleLanguage() {
    const currentLang = this.translate.currentLang;
    const newLang = currentLang === 'pt' ? 'en' : 'pt';
    this.translate.use(newLang);
  }
}
