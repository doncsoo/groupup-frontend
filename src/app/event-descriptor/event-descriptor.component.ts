import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from '../authservice.service';

@Component({
  selector: 'event-descriptor',
  templateUrl: './event-descriptor.component.html',
  styleUrls: ['./event-descriptor.component.scss']
})
export class EventDescriptorComponent implements OnInit {

  eventId : string | null = null
  event : any | null = null
  attendantsData : any | null = null
  imgsrc : string | null = null
  response : string = "no"

  //date related
  months : string[] = ['Január', 'Február', 'March', 'Április', 'Május', 'Június', 'Július', 'Augusztus', 'Szeptember',
                      'Október', 'November', 'December']
  year : number = 2021
  monthday : string | null = null
  time : string | null = null

  //voting related
  selected : number = -1
  didVote : boolean = false

  //more detail related
  shown : string = "none"

  //invited related
  invite_shown : string = "none"
  found_users : any[] = [];
  search : string | null = null
  selected_invite : string[] = []
  invite_loading : boolean = false

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) {}

  loading(): boolean {
    return this.eventId == null || this.event == null || this.imgsrc == null
  }

  async ngOnInit() {
    //use ?eventId=xxxx - in url
    if(this.auth.token == null) this.router.navigate(['/login'],  { queryParams: {origin: "event"}})
    this.route.queryParams.subscribe(params => {
      this.eventId = params['eventId'];
    });
    this.event = await this.auth.getEventById(this.eventId)
    this.imgsrc = this.auth.getImgUrl(this.eventId)
    this.response = this.getResponse()
    this.getFormattedDate()
    //voting check
    if(this.event.voting != null)
    {
      this.didVote = this.event.voting.voted.includes(this.auth.userid)
    }
    let attendants = this.event.attendants.map((item) => { return item.userid })
    this.attendantsData = await this.auth.getAttendants(attendants)
    console.log(this.attendantsData)
  }

  getFormattedDate() {
    if(this.event.date != null) {
      let datestr = this.event.date
      this.year = datestr.substring(0,4)
      let month = datestr.substring(5,7)
      let day = datestr.substring(8,10)
      this.time = datestr.substring(11,16)
      let monthstr = this.months[Number(month) - 1]
      this.monthday = monthstr + " " + day
    }
  }

  getPaymentDesc(payment) {
    switch(payment)
    {
      case "bankcard":
        return "Bankkártya"
      case "cash":
        return "Készpénz"
      case "szépcard":
        return "Széchényi Pihenőkártya"
    }
  }

  resetResponse()
  {
    this.response = "pending"
  }

  getResponse() : string {
    let resp = undefined
    for(let person of this.event.attendants)
    {
      if(person.userid == this.auth.userid)
      {
        resp = person.response
        break
      }
    }
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

  async respondWithYes()
  {
    let result = await this.auth.respond(this.eventId, true)
    if(result === true)
    {
      this.response = "accept"
      this.auth.setNotification("good", "A válaszod frissítve!")
    }
    else if (result == "Not vaccinated") this.auth.setNotification("bad", "Sajnos nem rendelkezel oltási igazolvánnyal hogy részt vehess!")
    else this.auth.setNotification("bad", "Hiba történt! Kérem próbálja később!")
  }

  async respondWithNo()
  {
    let result = await this.auth.respond(this.eventId, false)
    if(result === true)
    {
      this.response = "no"
      this.auth.setNotification("good", "A válaszod frissítve!")
    }
    else if (result == "Not vaccinated") this.auth.setNotification("bad", "Sajnos nem rendelkezel oltási igazolvánnyal hogy részt vehess!")
    else this.auth.setNotification("bad", "Hiba történt! Kérem próbálja később!")
  }

  async vote()
  {
    let result = this.auth.vote(this.eventId, this.selected)
    if(result)
    {
      this.event.voting.replies[this.selected].votes += 1      
      this.didVote = true
      this.auth.setNotification("good", "A szavazat rögzítve!")
    }
    else this.auth.setNotification("bad", "Hiba történt! Kérem próbálja később!")
  }

  determineAttendance(attendant)
  {
    for(let person of this.event.attendants)
    {
      if(person.userid == attendant._id)
      {
        switch(person.response)
        {
          case true:
            return "accept"
          case false:
            return "no"
          case null:
            return "pending"
        }
      }
    }
  }

  showMore()
  {
    if(this.shown == "none") this.shown = "block"
    else this.shown = "none"
  }

  showInvite()
  {
    if(this.invite_shown == "none") this.invite_shown = "block"
    else this.invite_shown = "none"
  }

  async searchForUsers()
  {
    let result = await this.auth.searchUser(this.search)
    const flat_attendants = this.event.attendants.map(a => a.userid)
    console.log(flat_attendants)
    this.found_users = result.filter(u => !flat_attendants.includes(u._id))
  }

  isOwner()
  {
    return this.event.owner == this.auth.userid
  }

  modifyInvite(userid)
  {
    if(this.selected_invite.includes(userid)) this.selected_invite = this.selected_invite.filter(id => userid != id)
    else this.selected_invite.push(userid)
    console.log(this.selected_invite)
  }

  async invite()
  {
    this.invite_loading = true
    let result = await this.auth.invite(this.eventId, this.selected_invite)
    this.invite_loading = false
    this.invite_shown = "none"
    if(result == true) this.auth.setNotification("good", "A meghívás sikeres!")
    else this.auth.setNotification("bad", "Hiba történt a meghívás során!")
  }
}
