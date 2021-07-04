import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { EventlistComponent } from './eventlist/eventlist.component';
import { HeaderComponent } from './header/header.component';
import { EventPanelComponent } from './event-panel/event-panel.component';
import { EventDescriptorComponent } from './event-descriptor/event-descriptor.component';
import { SetupPanelComponent } from './setup-panel/setup-panel.component';
import { LoginComponent } from './login/login.component';
import { NotificationManagerComponent } from './notification-manager/notification-manager.component';
import { TooltipModule, TooltipOptions } from 'ng2-tooltip-directive';
import { BooleanModifyPipe } from './boolean-modify.pipe';
import { UserManagerComponent } from './user-manager/user-manager.component';
import { DateConverterPipe } from './date-converter.pipe';

const routes: Routes = [
  { path: '', component: EventlistComponent },
  { path: 'setup', component: SetupPanelComponent },
  { path: 'event', component: EventDescriptorComponent },
  { path: 'login', component: LoginComponent },
  { path: 'user', component: UserManagerComponent },
]

const GroupUpTooltipOptions: TooltipOptions = {
  'show-delay': 750,
  'tooltip-class': 'lexend',
  'max-width': 700
}

@NgModule({
  declarations: [
    AppComponent,
    EventlistComponent,
    HeaderComponent,
    EventPanelComponent,
    EventDescriptorComponent,
    SetupPanelComponent,
    LoginComponent,
    NotificationManagerComponent,
    BooleanModifyPipe,
    UserManagerComponent,
    DateConverterPipe
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    TooltipModule.forRoot(GroupUpTooltipOptions as TooltipOptions)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
