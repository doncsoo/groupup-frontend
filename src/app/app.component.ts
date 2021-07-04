import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './authservice.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(public auth: AuthService, public cookies : CookieService) {}
  title = 'groupup-angular';

  ngOnInit()
  {
    if(window.innerWidth < 1000 && this.cookies.check('mobile-warning') == false)
    {
      alert("A mobilos nézet jelenleg fejlesztés alatt van. Kérlek szólj ha valami nem működik.")
      this.cookies.set('mobile-warning', 'shown')
    }
  }

  getCurrentNotification()
  {
    return this.auth.currentNotification
  }

}
