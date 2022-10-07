import { RouterModule, Routes } from '@angular/router'
import { SchedulerComponent } from './scheduler.component'
import { AppointmentComponent } from './components/appointment/appointment.component'

/**
 * Scheduler page routes
 */
const SCHEDULER_ROUTES: Routes = [
  {
    path: '',
    component: SchedulerComponent,
    children: [
      {
        path: ':viewType/:selectedDate',
        component: AppointmentComponent,
      },
    ],
  },
]

export const SchedulerRoutes = RouterModule.forChild(SCHEDULER_ROUTES)
