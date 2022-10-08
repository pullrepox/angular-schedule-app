import { Injectable } from '@angular/core'
import { Subject, BehaviorSubject, Observable } from 'rxjs'

@Injectable()
export class AppState {
  public editDataDetails: any = {}
  public subject = new Subject<any>()
  private dataSource = new BehaviorSubject(this.editDataDetails)
  currentStateData: Observable<any> = this.dataSource.asObservable()

  changeStateData(data: any) {
    this.dataSource.next(data)
  }
}
