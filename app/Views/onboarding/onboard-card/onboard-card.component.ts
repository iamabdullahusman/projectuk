import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-onboard-card',
  templateUrl: './onboard-card.component.html',
  styleUrls: ['./onboard-card.component.sass']
})
export class OnboardCardComponent {
  @Input() application:any;
  @Input() footerClass='';
  @Input() newLabel='';
  @Input() headerClass='';
  @Input() dateLabel='';
  @Input() date?:Date;
  @Input() isShowTime=true;
}
