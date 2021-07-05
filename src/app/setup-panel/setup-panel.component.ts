import { ThrowStmt } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../authservice.service';

@Component({
  selector: 'setup-panel',
  templateUrl: './setup-panel.component.html',
  styleUrls: ['./setup-panel.component.scss']
})
export class SetupPanelComponent implements OnInit {

  task: string | null = null
  steps : number = 5;
  stepStatus : string[] = []
  currentstep : number = 0;
  loading : boolean = false

  //reg-code for identification options
  regCode: number | null = null

  //register
  username: string | null = null
  password: string | null = null
  fullname: string | null = null
  vaccinated: boolean = false
  vaccinatedTimestamp : boolean | string | null = null

  //newevent
  event: any = 
  {
    title:null,
    owner:null,
    attendants:[],
    description:"",
    date:null,
    info:{
       price:null,
       website:null,
       vaccinationRequired:false,
       entryInfo:null,
       travelInfo:null,
       duration:null
    },
    voting:null,
    announcements:[]
 }

  constructor(
    private auth : AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    //use ?task=xxxx - in url
    this.route.queryParams.subscribe(params => {
      this.task = params['task'];
      this.regCode = params['code'];
    });

    if(this.task == "register")
    {
      if(this.auth.token != null) this.router.navigate(["/"])
      this.steps = 3
    } 
    else if(this.task == "newevent") this.steps = 5

    this.stepStatus = Array(this.steps)
    this.stepStatus.fill("step-pending", 0, this.steps - 1)
  }

  advanceSetup() : void {
    //insert here verification shit
    this.stepStatus[this.currentstep] = "step-done"
    this.currentstep++
    this.loading = false
  }

  async sendRegister() : Promise<void> {
    this.loading = true
    let json = {"username": this.username,"fullname": this.fullname,"password": this.password, "code": this.regCode}
    let result = await this.auth.register(json)
    if(result == true) this.advanceSetup()
    else
    {
      this.loading = false
      this.auth.setNotification("bad", "Hiba történt a regisztráció során! Ellenőrizd az adatokat!")
    }
  }

  async setVaccination() : Promise<void> {
    this.loading = true
    let json = null
    if(this.vaccinated == true && this.vaccinatedTimestamp) json = {vaccinated: this.vaccinatedTimestamp}
    else json = {vaccinated: this.vaccinated}
    let result = await this.auth.updateUser(json)
    if(result == true) this.advanceSetup()
    else
    {
      this.loading = false
      this.auth.setNotification("bad", "Ismeretlen hiba történt!")
    }
  }
}
