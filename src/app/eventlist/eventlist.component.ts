import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../authservice.service';

@Component({
  selector: 'eventlist',
  templateUrl: './eventlist.component.html',
  styleUrls: ['./eventlist.component.scss']
})
export class EventlistComponent implements OnInit {

  events : any[] | null = null

  constructor(private auth : AuthService) { }

  async ngOnInit(): Promise<void> {
    this.events = this.auth.events
    await this.auth.getEvents()
    this.events = this.auth.events
  }

  hamarosan()
  {
    alert("Hamarosan!")
  }

}
