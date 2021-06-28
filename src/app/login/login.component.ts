import { Component, OnInit } from '@angular/core';
import { AuthService } from '../authservice.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  username : string | null = null
  password : string | null = null
  loading : boolean = false

  show_info_1 : boolean = false

  constructor(public auth : AuthService, private router : Router, private route : ActivatedRoute) { }

  ngOnInit()
  {
    this.route.queryParams.subscribe(params => {
      this.show_info_1 = params['origin'] == "event";
    });
  }

  async queryAuth(): Promise<void> {
    this.loading = true
    let result = await this.auth.login(this.username, this.password)
    if(result == true)
    {
      this.router.navigate(["/"])
      this.auth.setNotification("normal", "Sikeresen bejelentkeztél! Üdv újra!")
    }
    else
    {
      this.loading = false
      this.auth.setNotification("bad", "A bejelentkezés sikertelen!")
    }
  }
}
