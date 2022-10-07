import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { CustomMaterialModule } from './core/material.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { MatNativeDateModule } from '@angular/material/core'
import { HttpClientModule } from '@angular/common/http'
import { AppState } from './app.service'

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatNativeDateModule,
    CustomMaterialModule,
    ReactiveFormsModule,
  ],
  providers: [AppState],
  bootstrap: [AppComponent],
})
export class AppModule {}
