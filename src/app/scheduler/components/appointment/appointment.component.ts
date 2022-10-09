import { Component, OnInit } from '@angular/core'
import { AppState } from '../../../app.state'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss'],
})
export class AppointmentComponent implements OnInit {
  private _state
  private _route

  stateData: any = {}

  constructor(route: ActivatedRoute, state: AppState) {
    this._route = route
    this._state = state
  }

  public ngOnInit() {
    this._state.currentStateData.subscribe((msg) => this.watchStateData(msg))
  }

  /**
   * watch global state data
   * @param msg
   */
  watchStateData(msg: any) {
    this.stateData = msg
  }

  /**
   * Calc week dates for calendar header
   */
  get calcWeekDates() {
    let week = []
    const curr = new Date(this.stateData.selDate.getTime())

    if (this.stateData.selType === 'D') {
      return [curr.getDate()]
    }

    for (let i = 0; i <= 6; i++) {
      let first = curr.getDate() - curr.getDay() + i
      const day = new Date(curr.setDate(first)).getDate()
      week.push(day)
    }

    return week
  }

  /**
   * compute cols by selected calendar type
   */
  get computeCols() {
    return this.stateData.selType === 'D' ? 1 : 7
  }

  get localTimeZone() {
    const timezone: any = new Date().toString().match(/([A-Z]+[+-][0-9]+)/)

    return timezone ? timezone[0].slice(0, 6) : ''
  }

  get timeList() {
    let hours: any = []

    for (let t = 1; t < 12; t++) {
      hours.push(`${t} AM`)
    }

    hours.push('12 PM')

    for (let t = 1; t < 12; t++) {
      hours.push(`${t} PM`)
    }

    return hours
  }

  /**
   * set active date
   *
   * @param d
   */
  getHeaderColor(d: number) {
    const curr = new Date(this.stateData.selDate.getTime())

    return curr.getDate() === d ? 'primary' : ''
  }

  /**
   * Get week headers
   * @param d
   */
  getWeekHeaders(d: number) {
    const weeks = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

    if (this.stateData.selType === 'D') {
      const curr = new Date(this.stateData.selDate.getTime())

      return weeks[curr.getDay()]
    }

    return weeks[d]
  }

  /**
   * Update selected date and type if clicking date of header when view type is week
   * @param d
   */
  updateSelDate(d: number) {
    if (this.stateData.selType === 'D') {
      return
    }

    const curr = new Date(this.stateData.selDate.getTime())
    curr.setDate(d)

    this._state.changeStateData({
      ...this.stateData,
      selType: 'D',
      selDate: curr,
    })
  }
}
