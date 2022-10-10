import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { CustomMaterialModule } from '../core/material.module'
import { SchedulerComponent } from './scheduler.component'
import { SchedulerRoutes } from './scheduler.routes'
import { DatePickerComponent } from './components/date-picker/date-picker.component'
import { AppointmentComponent } from './components/appointment/appointment.component'
import { AppState } from '../app.state'

@NgModule({
  declarations: [SchedulerComponent, DatePickerComponent, AppointmentComponent],
  imports: [
    SchedulerRoutes,
    CommonModule,
    FormsModule,
    CustomMaterialModule,
    ReactiveFormsModule,
  ],
  providers: [AppState],
})
export class SchedulerModule {
  public appState

  constructor(appState: AppState) {
    this.appState = appState
  }
}
