import { Component } from '@angular/core';
import { AuthService } from './authservice.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(public auth: AuthService) {}
  title = 'groupup-angular';

  getCurrentNotification()
  {
    return this.auth.currentNotification
  }

}
