import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../authservice.service';

@Component({
  selector: 'event-panel',
  templateUrl: './event-panel.component.html',
  styleUrls: ['./event-panel.component.scss']
})
export class EventPanelComponent implements OnInit {
  @Input() eventid : string | null = null
  @Input() response : string = "pending"
  @Input() title : string = "Event"
  imgsrc : string | null = null
  authenticated : boolean = false

  constructor(private router : Router, private auth : AuthService) { }

  ngOnInit(): void {
    if(this.eventid != null) this.imgsrc = this.auth.getImgUrl(this.eventid)
    this.authenticated = this.auth.token != null
  }

  navigate() : void {
    if(this.authenticated) this.router.navigate(['/event'], { queryParams: {eventId: this.eventid}})
    else this.router.navigate(['/login'], { queryParams: {origin: "event"}})
  }

  getResponse() : string {
    let resp = this.auth.getEventResponse(this.eventid)
    switch(resp)
    {
      case true:
        return "accept"
      case false:
        return "no"
      default:
        return "pending"
    }
  }
}
