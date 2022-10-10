/* eslint-disable no-unused-vars */
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core'
import { Overlay, OverlayRef } from '@angular/cdk/overlay'
import { TemplatePortal } from '@angular/cdk/portal'
import { ActivatedRoute } from '@angular/router'
import { FormControl } from '@angular/forms'
import { MatDatepickerInputEvent } from '@angular/material/datepicker'
import { AppState } from '../../../app.state'
import {
  CdkDragDrop,
  CdkDragEnd,
  CdkDragMove,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop'

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss'],
})
export class AppointmentComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('editDialogTemplate', { read: TemplateRef })
  _dialogTemplate!: TemplateRef<any>
  private _overlayRef!: OverlayRef
  private _portal!: TemplatePortal

  private _state
  private _route
  selectedD: number = 0

  tempAppointment: any = []

  stateData: any = {}
  appointmentList: any = {}
  offsetY: number = 0
  endY: number = 0
  editFlag: boolean = false
  selDelInd: number = 0

  constructor(
    private _overlay: Overlay,
    private _viewContainerRef: ViewContainerRef,
    route: ActivatedRoute,
    state: AppState
  ) {
    this._route = route
    this._state = state
  }

  public ngOnInit() {
    this._state.currentStateData.subscribe((msg) => this.watchStateData(msg))
  }

  ngAfterViewInit() {
    this._portal = new TemplatePortal(
      this._dialogTemplate,
      this._viewContainerRef
    )

    this._overlayRef = this._overlay.create({
      positionStrategy: this._overlay
        .position()
        .global()
        .centerHorizontally()
        .centerVertically(),
      hasBackdrop: true,
    })

    this._overlayRef.backdropClick().subscribe(() => {
      this.ngOnDestroy()
    })
  }

  ngOnDestroy() {
    this._overlayRef.detach()

    if (!this.editFlag) {
      this.removeTempData(this.selectedD)
      this.stateData.tempEditData = Object.assign(
        {},
        this.tempAppointment[this.selectedD]
      )

      this._state.changeStateData({
        ...this.stateData,
        openNewDialog: false,
        tempEditData: this.tempAppointment[this.selectedD],
      })
    }

    this.editFlag = false
  }

  openDialog(event: MouseEvent, d: number) {
    this._overlayRef.attach(this._portal)
    this.editFlag = false
    this.clearTempAppointment(true, d)
    this.removeTempData(d)
    const fTime = Math.floor(event.offsetY / 48)
    this.tempAppointment[d].timeRange = [fTime, fTime + 1]
    this.tempAppointment[d].timeStr = [`${fTime}:00`, `${fTime + 1}:00`]
    this.tempAppointment[d].top = `${fTime * 48}px`

    if (this.stateData.selType === 'D') {
      const currD = new Date()
      if (this.stateData.selDate.getDate() === currD.getDate()) {
        this.tempAppointment[d].date = new FormControl(currD)
        this.tempAppointment[d].dateVal = currD
        this.tempAppointment[d].dateStr = currD.toISOString().slice(0, 10)
      } else {
        this.tempAppointment[d].date = new FormControl(this.stateData.selDate)
        this.tempAppointment[d].dateVal = this.stateData.selDate
        this.tempAppointment[d].dateStr = new Date(
          this.stateData.selDate.getTime() + 1000 * 60 * 60 * 24
        )
          .toISOString()
          .slice(0, 10)
      }
    } else {
      const curr = new Date()
      let first =
        this.stateData.selDate.getDate() - this.stateData.selDate.getDay() + d
      const changeD = new Date(curr.setDate(first))
      this.tempAppointment[d].date = new FormControl(changeD)
      this.tempAppointment[d].dateVal = changeD
      this.tempAppointment[d].dateStr = changeD.toISOString().slice(0, 10)
    }

    this.stateData.tempEditData = Object.assign({}, this.tempAppointment[d])
  }

  /**
   * watch global state data
   * @param msg
   */
  watchStateData(msg: any) {
    this.stateData = msg
    if (this.stateData.openNewDialog) {
      this._overlayRef.attach(this._portal)
      this.editFlag = false

      if (this.stateData.selType === 'D') {
        this.clearTempAppointment(true, 0)
      } else this.clearTempAppointment(true, this.stateData.selDate.getDay())

      return
    }

    if (this.stateData.selType === 'D') {
      this.clearTempAppointment(false, 0)
    } else {
      for (let d = 0; d < 7; d++) {
        this.clearTempAppointment(false, d)
      }
    }

    if (this.stateData.appointmentList) {
      this.appointmentList = Object.assign({}, this.stateData.appointmentList)
    }

    const curr = new Date(this.stateData.selDate.getTime())

    if (this.stateData.selType === 'D') {
      if (!this.appointmentList[curr.toISOString().slice(0, 10)]) {
        this.appointmentList[curr.toISOString().slice(0, 10)] = []
      }
    }

    for (let i = 0; i <= 6; i++) {
      let first = curr.getDate() - curr.getDay() + i
      const dayStr = new Date(curr.setDate(first)).toISOString().slice(0, 10)
      if (!this.appointmentList[dayStr]) {
        this.appointmentList[dayStr] = []
      }
    }
  }

  /**
   * Clear edit temp data
   *
   * @param open
   * @param d
   */
  clearTempAppointment(open: boolean, d: number) {
    this.selectedD = d

    if (!this.tempAppointment[d]) {
      this.tempAppointment[d] = {}
    }

    if (this.stateData.tempEditData) {
      this.tempAppointment[d] = this.stateData.tempEditData
    } else {
      this.removeTempData(d)
      if (this.stateData.selType === 'D') {
        this.tempAppointment[d].date = new FormControl(this.stateData.selDate)
        this.tempAppointment[d].dateVal = this.stateData.selDate
      } else {
        const curr = new Date(this.stateData.selDate.getTime())
        let first = curr.getDate() - curr.getDay() + d
        const uDate = new Date(curr.setDate(first))
        this.tempAppointment[d].date = new FormControl(uDate)
        this.tempAppointment[d].dateVal = uDate
      }

      this.tempAppointment[d].dateStr = new Date(
        this.tempAppointment[d].dateVal.getTime()
      )
        .toISOString()
        .slice(0, 10)
    }

    this.tempAppointment[d].showButton = open

    this.stateData.tempEditData = Object.assign({}, this.tempAppointment[d])
  }

  /**
   * Calc week dates for calendar header
   */
  get calcWeekDates() {
    let week = []
    const curr = new Date(this.stateData.selDate.getTime())

    if (this.stateData.selType === 'D') {
      // eslint-disable-next-line no-undef
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

  /**
   * get local timezone string
   */
  get localTimeZone() {
    const timezone: any = new Date().toString().match(/([A-Z]+[+-][0-9]+)/)

    return timezone ? timezone[0].slice(0, 6) : ''
  }

  /**
   * get calendar time list
   */
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
   * get select time picker list
   */
  get timePickerList() {
    let hoursList: any = []
    for (let h = 0; h < 24; h++) {
      hoursList.push(h)
    }
    return hoursList
  }

  /**
   * Change Time picker
   * @param ind
   */
  changeTimePicker(ind: number) {
    if (this.editFlag) return

    if (ind === 0) {
      if (this.tempAppointment[this.selectedD].timeRange[0] === 23) {
        this.tempAppointment[this.selectedD].timeRange[0] = 22
        this.tempAppointment[this.selectedD].timeRange[1] = 23
      } else {
        this.tempAppointment[this.selectedD].timeRange[1] =
          this.tempAppointment[this.selectedD].timeRange[0] + 1
      }
    } else {
      if (this.tempAppointment[this.selectedD].timeRange[1] === 0) {
        this.tempAppointment[this.selectedD].timeRange[0] = 0
        this.tempAppointment[this.selectedD].timeRange[1] = 1
      } else {
        this.tempAppointment[this.selectedD].timeRange[0] =
          this.tempAppointment[this.selectedD].timeRange[1] - 1
      }
    }

    const fTime = this.tempAppointment[this.selectedD].timeRange[0]
    this.tempAppointment[this.selectedD].timeStr = [
      `${fTime}:00`,
      `${fTime + 1}:00`,
    ]
    this.tempAppointment[this.selectedD].top = `${fTime * 48}px`
  }

  /**
   * Change date picker
   *
   * @param event
   */
  changeDatePicker(event: MatDatepickerInputEvent<Date>) {
    if (this.editFlag) return

    const currD = event.value ?? new Date()
    this.tempAppointment[this.selectedD].showButton = false
    this.tempAppointment[this.selectedD].dateVal = new Date(currD.getTime())
    this.tempAppointment[this.selectedD].dateStr = new Date(
      currD.getTime() + 1000 * 60 * 60 * 24
    )
      .toISOString()
      .slice(0, 10)

    this.stateData.tempEditData = Object.assign(
      {},
      this.tempAppointment[this.selectedD]
    )

    this._overlayRef.detach()

    this._state.changeStateData({
      ...this.stateData,
      selDate: new Date(currD.getTime()),
      openNewDialog: true,
    })
  }

  /**
   * save edit data
   */
  saveTempEditData() {
    if (this.editFlag) return

    if (
      this.tempAppointment[this.selectedD].title === '' ||
      this.tempAppointment[this.selectedD].description === ''
    ) {
      return
    }

    if (!this.appointmentList[this.tempAppointment[this.selectedD].dateStr]) {
      this.appointmentList[this.tempAppointment[this.selectedD].dateStr] = []
    }

    if (!this.editFlag) {
      this.appointmentList[this.tempAppointment[this.selectedD].dateStr].push({
        top: this.tempAppointment[this.selectedD].top,
        date: this.tempAppointment[this.selectedD].dateStr,
        data: Object.assign({}, this.tempAppointment[this.selectedD]),
      })
    }

    this._overlayRef.detach()

    this.removeTempData(this.selectedD)

    if (!this.editFlag) {
      this._state.changeStateData({
        ...this.stateData,
        openNewDialog: false,
        appointmentList: Object.assign({}, this.appointmentList),
      })
    }
  }

  removeTempData(d: number) {
    this.tempAppointment[d].title = ''
    this.tempAppointment[d].description = ''
    this.tempAppointment[d].timeRange = [0, 1]
    this.tempAppointment[d].timeStr = ['0 AM', '1 AM']
    this.tempAppointment[d].top = 0
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
      this._overlayRef.attach(this._portal)
      this.clearTempAppointment(true, this.selectedD)

      return
    }

    const curr = new Date(this.stateData.selDate.getTime())
    let first = curr.getDate() - curr.getDay() + d
    const uDate = new Date(curr.setDate(first))

    this._state.changeStateData({
      ...this.stateData,
      selType: 'D',
      selDate: uDate,
    })
  }

  /**
   * Get appointment data key
   *
   * @param d
   */
  getAppointDate(d: number) {
    if (this.stateData.selType === 'D') {
      if (this.stateData.selDate.getDate() === new Date().getDate()) {
        return new Date().toISOString().slice(0, 10)
      } else {
        return new Date(this.stateData.selDate.getTime())
          .toISOString()
          .slice(0, 10)
      }
    }

    const curr = new Date()
    let first =
      this.stateData.selDate.getDate() - this.stateData.selDate.getDay() + d
    return new Date(curr.setDate(first)).toISOString().slice(0, 10)
  }

  getOffset(event: MouseEvent) {
    this.offsetY = event.offsetY
  }

  public onDragMove(event: CdkDragMove<any>): void {
    this.endY = event.pointerPosition.y - this.offsetY
  }

  onDragEnded(event: CdkDragEnd<any>, appoint: any) {
    const fTime = Math.floor((this.endY - 150) / 48)
    appoint.data.timeRange = [fTime, fTime + 1]
    appoint.data.timeStr = [`${fTime}:00`, `${fTime + 1}:00`]
    appoint.data.top = `${fTime * 48}px`
    appoint.top = `${fTime * 48}px`
  }

  drop(event: CdkDragDrop<any[]>, i: number) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      )
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      )
    }

    const sDateStr = this.getAppointDate(i)

    const curr = new Date()
    let first =
      this.stateData.selDate.getDate() - this.stateData.selDate.getDay() + i
    const updatedDate = new Date(curr.setDate(first))

    for (let ud = 0; ud < this.appointmentList[sDateStr].length; ud++) {
      this.appointmentList[sDateStr][ud] = {
        date: sDateStr,
        top: event.container.data[ud].top,
        data: {
          ...event.container.data[ud].data,
          dateVal: updatedDate,
          dateStr: sDateStr,
          date: new FormControl(updatedDate),
        },
      }
    }

    this._state.changeStateData({
      ...this.stateData,
      appointmentList: Object.assign({}, this.appointmentList),
    })
  }

  clickAppointment(event: MouseEvent, i: number, appoint: any, d: number) {
    event.stopPropagation()

    this.selectedD = i
    this.tempAppointment[i] = appoint.data
    this.tempAppointment[i].dateStr = appoint.date
    this.tempAppointment[i].showButton = false
    this.stateData.tempEditData = Object.assign({}, this.tempAppointment[i])
    this.editFlag = true
    this.selDelInd = d
    this._overlayRef.attach(this._portal)
  }

  deleteAppointment() {
    this.appointmentList[this.tempAppointment[this.selectedD].dateStr].splice(
      this.selDelInd,
      1
    )
    this.removeTempData(this.selectedD)
    this._overlayRef.detach()
    this.editFlag = false
  }
}
