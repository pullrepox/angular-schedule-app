import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
} from '@angular/core'
import { MatCalendar } from '@angular/material/datepicker'

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent implements OnChanges {
  @Input() selectedDate?: Date

  selected: Date | undefined

  constructor() {
    this.selected = this.selectedDate ?? new Date()
  }

  @Output() changeCalendar = new EventEmitter<any>()

  @ViewChild('calendar', { static: false }) calendar:
    | MatCalendar<Date>
    | undefined

  public ngOnChanges() {
    this.selected = this.selectedDate
    if (this.selected && this.calendar) {
      this.calendar._goToDateInView(this.selected, 'month')
    }
  }

  changeDate() {
    this.changeCalendar.emit(this.selected)
  }
}
