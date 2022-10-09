import { Component, OnInit, ViewChild } from '@angular/core'
import { DatePickerComponent } from './components/date-picker/date-picker.component'
import { Router } from '@angular/router'
import { AppState } from '../app.state'

interface CalendarViewType {
  value: string
  viewValue: string
}

@Component({
  selector: 'app-layout',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss'],
})
export class SchedulerComponent implements OnInit {
  private _router
  private _state
  stateData: any = {}

  opened: boolean
  selectedDate: Date
  types: CalendarViewType[] = [
    { value: 'D', viewValue: 'Day' },
    { value: 'W', viewValue: 'Week' },
  ]
  selectedViewType: string = 'D'

  @ViewChild('primaryDatePicker', { static: false })
  primaryDatePicker: DatePickerComponent | undefined

  constructor(router: Router, state: AppState) {
    this._router = router
    this._state = state

    this.opened = true
    this.selectedDate = new Date()
  }

  public ngOnInit() {
    if (this.selectedDate) {
      this.updateNavigate(this.selectedDate)
    }

    this._state.currentStateData.subscribe((msg) => this.watchStateData(msg))
    this._state.changeStateData({
      ...this.stateData,
      selDate: this.selectedDate,
      selType: this.selectedViewType,
      openNewDialog: false,
    })
  }

  /**
   * update class when toggle left side nav
   */
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
  setSelectedDate(newDate: Date) {
    this.selectedDate = newDate
    this._state.changeStateData({
      ...this.stateData,
      selDate: newDate,
    })

    if (newDate) {
      this.updateNavigate(newDate)
    }
  }

  /**
   * emit clicking today button
   *
   * @constructor
   */
  setToday() {
    this.setSelectedDate(new Date())
  }

  /**
   * emit clicking prev/next button
   *
   * @param plus boolean
   * @constructor
   */
  setPrevNextDate(plus: boolean) {
    const getCurSelectedDate = plus
      ? new Date(this.selectedDate.getTime() + 1000 * 60 * 60 * 24)
      : new Date(this.selectedDate.getTime() - 1000 * 60 * 60 * 24)

    this.setSelectedDate(getCurSelectedDate)
  }

  /**
   * Change book type
   * @constructor
   */
  changeViewType() {
    this._state.changeStateData({
      ...this.stateData,
      selType: this.selectedViewType,
    })

    this.updateNavigate(this.selectedDate)
  }

  /**
   * Update navigate when changing date and book type
   * @param currDate
   * @constructor
   */
  updateNavigate(currDate: Date) {
    this._router.navigate([
      `/${this.types[
        this.selectedViewType === 'D' ? 0 : 1
      ].viewValue.toLowerCase()}/${currDate.toISOString().slice(0, 10)}`,
    ])
  }

  /**
   * Open new appointment create dialog
   */
  createNewAppointment() {
    this._state.changeStateData({
      ...this.stateData,
      openNewDialog: true,
    })
  }

  /**
   * watch global state data
   * @param msg
   */
  watchStateData(msg: any) {
    const oldStateData = Object.assign({}, this.stateData)

    this.stateData = msg

    if (oldStateData.selType !== this.stateData.selType) {
      this.selectedDate = this.stateData.selDate
      this.selectedViewType = this.stateData.selType

      this.updateNavigate(this.stateData.selDate)
    }
  }
}
