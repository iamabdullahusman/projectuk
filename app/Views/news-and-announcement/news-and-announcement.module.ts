import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NewsAndAnnouncementComponent } from "./news-and-announcement.component";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    NewsAndAnnouncementComponent
  ],
  exports: [NewsAndAnnouncementComponent],
})
export class NewsAndAnnouncementModule {}
