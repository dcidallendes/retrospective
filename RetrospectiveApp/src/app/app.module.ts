import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import {MatToolbarModule, MatCardModule, MatFormFieldModule, MatInputModule, MatDividerModule, MatButtonModule, MatSlideToggleModule, MatGridListModule, MatListModule, MatIconModule} from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './common/header/header.component';
import { FooterComponent } from './common/footer/footer.component';
import { JoinRoomComponent } from './join-room/join-room.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NotesPanelComponent } from './notes-panel/notes-panel.component';

const config: SocketIoConfig = { url: 'http://127.0.0.1:3001', options: {} };

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
    MatSlideToggleModule,
    MatGridListModule,
    MatListModule,
    MatIconModule,
    FlexLayoutModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [FormBuilder],
  bootstrap: [AppComponent]
})
export class AppModule { }
