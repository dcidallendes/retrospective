import { Component, OnInit } from '@angular/core';
import { AuthService, SocialUser } from 'angularx-social-login';

@Component({
  selector: 'app-user-toolbar',
  templateUrl: './user-toolbar.component.html',
  styleUrls: ['./user-toolbar.component.scss']
})
export class UserToolbarComponent implements OnInit {

  user: SocialUser;

  constructor(private readonly authService: AuthService) { }

  get isLoggedIn(): boolean {
    return !!this.user;
  }

  ngOnInit() {
    this.authService.authState.subscribe(socialUser => {
      this.user =  socialUser;
    });
  }

  onLogoutClick() {
    if (this.isLoggedIn) {
      this.authService.signOut();
    }
  }
}
