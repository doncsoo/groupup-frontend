import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../authservice.service';

@Component({
  selector: 'user-manager',
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.scss']
})
export class UserManagerComponent implements OnInit {

  constructor(private auth : AuthService, private router : Router, private cookies : CookieService) { }

  ngOnInit(): void {
    if(this.auth.token == null) this.router.navigate(["/login"])
  }

  async logout()
  {
    let result = await this.auth.logout()
    if(result == true)
    {
      this.cookies.delete('last-token')
      this.auth.setNotification("normal", "Sikeresen kijelentkeztél!")
      this.router.navigate(["/"])
    }
  }

}
