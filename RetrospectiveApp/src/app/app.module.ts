import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {MatToolbarModule, MatCardModule, MatFormFieldModule, MatInputModule, MatDividerModule, MatButtonModule, MatSlideToggleModule} from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './common/header/header.component';
import { FooterComponent } from './common/footer/footer.component';
import { JoinRoomComponent } from './join-room/join-room.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NotesPanelComponent } from './notes-panel/notes-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    JoinRoomComponent,
    NotesPanelComponent
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatButtonModule,
    MatSlideToggleModule
  ],
  providers: [FormBuilder],
  bootstrap: [AppComponent]
})
export class AppModule { }
