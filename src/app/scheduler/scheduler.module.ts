import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'

import { CustomMaterialModule } from '../core/material.module'
import { SchedulerComponent } from './scheduler.component'
import { SchedulerRoutes } from './scheduler.routes'
import { DatePickerComponent } from './components/date-picker/date-picker.component'
import { AppointmentComponent } from './components/appointment/appointment.component'
import { AppState } from '../app.service'

@NgModule({
  declarations: [SchedulerComponent, DatePickerComponent, AppointmentComponent],
  imports: [SchedulerRoutes, CommonModule, FormsModule, CustomMaterialModule],
  providers: [AppState],
})
export class SchedulerModule {}
