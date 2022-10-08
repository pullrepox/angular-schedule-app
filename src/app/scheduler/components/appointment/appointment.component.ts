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
}
