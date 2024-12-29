import { Component, OnInit } from '@angular/core';
import { EmittService } from 'src/app/Services/emitt.service';
import { FeesService } from 'src/app/Services/fees.service';
import { ThemeOptions } from 'src/app/theme-options';

@Component({
  selector: 'app-notification-header',
  templateUrl: './notification-header.component.html'
})
export class NotificationHeaderComponent implements OnInit {
  toggleDrawer() {
    this.globals.toggleDrawer = !this.globals.toggleDrawer;
  }
  notifications = [];
  totalUnread = 0;
  constructor(public globals: ThemeOptions, private feesservices: FeesService,private emitService: EmittService) { 
    emitService.GetNewNotifications().subscribe(res=>{
      this.loadData();
    })
  }

  ngOnInit(): void {
    let that = this;
    this.loadData();
    setInterval(function () {
      that.loadData();
    }, 60000)
  }


  loadData() {
    this.feesservices.HeaderNotification().subscribe(res => {
      if (res.status) {
        this.notifications = res.data.records;
        this.totalUnread = res.data.totalCounts;
      }
    }, (err: any) => {
      console.log(err);
    })
  }

}
