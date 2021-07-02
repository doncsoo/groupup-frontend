import { ParseTreeResult } from '@angular/compiler';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { LEADING_TRIVIA_CHARS } from '@angular/compiler/src/render3/view/template';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  serverhost : string = "https://groupup-server.herokuapp.com"
  token: string | null = null
  didAuth : boolean = false

  //identificator
  username: string | null = null
  userid: string | null = null

  /////
  events: any[] | null = null 

  /// notification
  currentNotification : any | null = null

  constructor(private cookies : CookieService) {
    if(this.cookies.check('last-token') == true)
    {
      this.token = this.cookies.get('last-token')
      this.getUserData()
    }
  }

  async login(inp_username, inp_password)
  {
    console.log(inp_password)
    let result = await fetch(this.serverhost + "/auth", {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({username: inp_username, password: inp_password}),
            })
            .then(r => r.json());
    if(result.auth == true)
    {
      this.token = result.token
      this.cookies.set('last-token', this.token)
      this.getUserData()
      return true
    }
    else return result.error
  }

  async getUserData()
  {
    let result = await fetch(this.serverhost + "/who/" + this.token, {method: "GET"})
            .then(r => r.json());
    console.log(result)
    if(JSON.stringify(result) == '{}')
    {
      this.token = null
      this.cookies.delete('last-token')
    }
    else
    {
      this.username = result.username
      this.userid = result.userid
      this.didAuth = true
    }
  }

  async register(json)
  {
    let result = await fetch(this.serverhost + "/users", {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(json),
            })
            .then(r => r.json());
    if(result.success == true)
    {
      this.token = result.token
      console.log(this.token)
      return true
    }
    else return result.error
  }
  
  async updateUser(json)
  {
    if(!this.token) return false
    let result = await fetch(this.serverhost + "/users", {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({token: this.token, property: json}),
            })
            .then(r => r.status);
    return result == 204
  }

  async getEvents()
  {
    let result = await fetch(this.serverhost + "/events", {method: "GET"})
            .then(r => r.json());
    this.events = result
  }

  getImgUrl(eventid)
  {
    return this.serverhost + "/preview/" + eventid
  }

  async getEventById(eventid)
  {
    if(this.events == null)
    {
      let result = await fetch(this.serverhost + "/events/" + eventid, {method: "GET"})
            .then(r => r.json());
      return result[0]
    }
    else
    {
      for(let event of this.events)
      {
        if(event._id == eventid) return event
      }
    }
  }

  getEventResponse(eventid)
  {
    for(let event of this.events)
    {
      if(event._id == eventid)
      {
        for(let person of event.attendants)
        {
          if(person.userid == this.userid) return person.response
        }
      }
    }
  }

  async respond(inp_eventid, inp_response)
  {
    var error = null
    let result = await fetch(this.serverhost + "/respond", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({token: this.token, eventid: inp_eventid, response: inp_response}),
    }).then(async r => {
      if(r.status == 403)
      {
        error = await r.text()
      }
      return r.status
    });
    if(error == null) return result == 204
    else return error
  }

  async vote(inp_eventid, inp_index)
  {
    let result = await fetch(this.serverhost + "/vote", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({token: this.token, eventid: inp_eventid, index: inp_index}),
    }).then(r => r.status);
    if(result == 204) this.cookies.set(inp_eventid + '-didVote', "true")
    return result == 204
  }

  async getAttendants(inp_list)
  {
    let result = await fetch(this.serverhost + "/users/attendants", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({list: inp_list}),
    }).then(r => r.json());
    return result;
  }

  async logout()
  {
    let result = await fetch(this.serverhost + "/logout", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({token: this.token}),
    }).then(r => r.status);
    if(result == 204)
    {
      this.token = null
      this.didAuth = false
      return true
    }
    else return false
  }

  setNotification(inp_class, inp_message)
  {
    this.currentNotification = {class: "notification-" + inp_class, message: inp_message}
    setTimeout(() => this.currentNotification = null, 5000)
  }
}
