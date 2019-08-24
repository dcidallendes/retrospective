import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { MatToolbarModule, MatCardModule, MatFormFieldModule, MatInputModule, MatDividerModule, MatButtonModule, MatSlideToggleModule, MatGridListModule, MatListModule, MatIconModule, MatSnackBarModule, MatMenuModule } from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './common/header/header.component';
import { FooterComponent } from './common/footer/footer.component';
import { JoinRoomComponent } from './join-room/join-room.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NotesPanelComponent } from './notes-panel/notes-panel.component';
import { UserToolbarComponent } from './user-toolbar/user-toolbar.component';

import { SocialLoginModule, AuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { AvatarModule } from 'ngx-avatar';
import { environment } from 'src/environments/environment';

const socketConfig: SocketIoConfig = { url: environment.messagesUrl, options: {} };
const authConfig = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider(environment.googleClientId)
  }
]);

export function provideAuthConfig() {
  return authConfig;
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    JoinRoomComponent,
    NotesPanelComponent,
    UserToolbarComponent
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
    MatSnackBarModule,
    MatMenuModule,
    FlexLayoutModule,
    SocketIoModule.forRoot(socketConfig),
    SocialLoginModule,
    AvatarModule
  ],
  providers: [
    FormBuilder,
    {
      provide: AuthServiceConfig,
      useFactory: provideAuthConfig
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
