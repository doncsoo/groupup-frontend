import { Component, OnInit } from '@angular/core';
import { AuthService } from '../authservice.service';

@Component({
  selector: 'notification-manager',
  templateUrl: './notification-manager.component.html',
  styleUrls: ['./notification-manager.component.scss']
})
export class NotificationManagerComponent implements OnInit {

  constructor(private auth : AuthService) { }

  ngOnInit(): void {
  }

}
