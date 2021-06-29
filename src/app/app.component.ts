import { Component, OnInit } from '@angular/core';
import { AuthService } from './authservice.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(public auth: AuthService) {}
  title = 'groupup-angular';

  ngOnInit()
  {
    if(window.innerWidth < 1000) alert("Jelenleg nem támogatott mobilok és 1000px-nél rövidebb képernyők használata.")
    window.addEventListener('resize', 
    function () {
      if(window.innerWidth < 1000) alert("Jelenleg nem támogatott mobilok és 1000px-nél rövidebb képernyők használata.")
    })
  }

  getCurrentNotification()
  {
    return this.auth.currentNotification
  }

}
