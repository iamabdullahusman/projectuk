import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-teacher-item',
  templateUrl: './teacher-item.component.html',
  styleUrls: ['./teacher-item.component.sass']
})
export class TeacherItemComponent {
  @Input() label='';
  @Input() value='';
  @Input() customClass='text-muted';
  @Output() labelClick=new EventEmitter<void>();
  onClick(){
    this.labelClick.next();
  }
}
