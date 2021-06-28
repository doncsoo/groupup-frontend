import { Component, OnInit } from '@angular/core';
import { AuthService } from '../authservice.service';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(public auth : AuthService) { }

  hasToken(): boolean {
    return this.auth.didAuth == true
  }

  ngOnInit(): void {
  }

}
