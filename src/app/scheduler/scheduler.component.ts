import { Component, OnInit, ViewChild } from '@angular/core'
import { DatePickerComponent } from './components/date-picker/date-picker.component'
import { Router } from '@angular/router'

interface NoteType {
  value: string
  viewValue: string
}

@Component({
  selector: 'app-layout',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss'],
})
export class SchedulerComponent implements OnInit {
  private router
  opened: boolean
  selectedDate: Date
  types: NoteType[] = [
    { value: 'D', viewValue: 'Day' },
    { value: 'W', viewValue: 'Week' },
  ]
  selectedViewType: string = 'D'

  @ViewChild('primaryDatePicker', { static: false })
  primaryDatePicker: DatePickerComponent | undefined

  constructor(router: Router) {
    this.router = router
    this.opened = true
    this.selectedDate = new Date()
  }

  public ngOnInit() {
    if (this.selectedDate) {
      this.router.navigate([
        `/${this.types[
          this.selectedViewType === 'D' ? 0 : 1
        ].viewValue.toLowerCase()}/${this.selectedDate.getFullYear()}-${
          this.selectedDate.getMonth() + 1
        }-${this.selectedDate.getDate()}`,
      ])
    }
  }

  get eventContentClass() {
    return {
      'c-app-sidenav-closed': !this.opened,
      'c-app-sidenav-opened': this.opened,
    }
  }

  /**
   * Update selected date
   *
   * @param newDate
   * @constructor
   */
  SetSelectedDate(newDate: Date) {
    this.selectedDate = newDate

    if (newDate) {
      this.router.navigate([
        `/${this.types[
          this.selectedViewType === 'D' ? 0 : 1
        ].viewValue.toLowerCase()}/${newDate.getFullYear()}-${
          newDate.getMonth() + 1
        }-${newDate.getDate()}`,
      ])
    }
  }

  /**
   * emit clicking today button
   *
   * @constructor
   */
  SetToday() {
    this.SetSelectedDate(new Date())
  }

  /**
   * emit clicking prev/next button
   *
   * @param plus boolean
   * @constructor
   */
  SetPrevNextDate(plus: boolean) {
    const getCurSelectedDate = plus
      ? new Date(this.selectedDate.getTime() + 1000 * 60 * 60 * 24)
      : new Date(this.selectedDate.getTime() - 1000 * 60 * 60 * 24)

    this.SetSelectedDate(getCurSelectedDate)
  }

  ChangeViewType() {
    this.router.navigate([
      `/${this.types[
        this.selectedViewType === 'D' ? 0 : 1
      ].viewValue.toLowerCase()}/${this.selectedDate.getFullYear()}-${
        this.selectedDate.getMonth() + 1
      }-${this.selectedDate.getDate()}`,
    ])
  }
}
