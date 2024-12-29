import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { SessionStorageService } from 'src/app/Services/session-storage.service';
import { ThemeOptions } from '../../../../../theme-options';

@Component({
  selector: 'app-user-box',
  templateUrl: './user-box.component.html',
})
export class UserBoxComponent implements OnInit {

  faCalendar = faCalendar;
  UserName: any;
  userType: number;
  href : any;
  toggleDrawer() {
    this.globals.toggleDrawer = !this.globals.toggleDrawer;
  }

  constructor(public globals: ThemeOptions, private sessionService: SessionStorageService, private router: Router) {
  }

  ngOnInit() {
    this.UserName = this.sessionService.getUsername();
    this.userType = parseInt(this.sessionService.getUserType());
    if(this.userType == 5){
        this.href = "student/StudentProfile";
    }else{
      this.href = "pages/ProfilePage";
    }
  
  }

  redirectTOLogin(): any {
    this.sessionService.clearSession();
    localStorage.removeItem('token');
    // window.location.href = 'pages/login';
    this.router.navigate(['/pages/login'], { replaceUrl: true });

  }
}
