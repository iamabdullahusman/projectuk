import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/Services/notification.service';
import { ToastrServiceService } from 'src/app/services/toastr-service.service';
import { Notification } from 'src/app/Models/notification.model';
@Component({
  selector: 'app-news-and-announcement',
  templateUrl: './news-and-announcement.component.html',
  styleUrls: ['./news-and-announcement.component.sass']
})
export class NewsAndAnnouncementComponent implements OnInit {
  notifications:Array<Notification> = [];
  constructor(private notificationService:NotificationService, private toast:ToastrServiceService, private router:Router) { }

  ngOnInit(): void {
    this.loadNotification()
  }
  loadNotification(){
    this.notificationService.GetAllNewsAndAnnouncementNotifications().subscribe(res=>{
      if(res.status){
        this.notifications=res.data.records;
      } else{
        this.toast.SuccessToastr(res.message)
      }
    },(err:any)=> this.handleApiError(err))
  }

  handleApiError(err: any) {
    if (err.status == 401) {
      this.router.navigate(["/"]);
    } else {
      this.toast.ErrorToastr("Something went wrong");
    }
    this.notificationService.hideLoader();
  }
}
