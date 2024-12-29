import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Group } from 'src/app/Models/group.modal';
import { GroupService } from 'src/app/Services/group.service';
import { ToastrServiceService } from 'src/app/services/toastr-service.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.sass']
})
export class GroupComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  modalTitle = '';
  groupForm = new FormGroup({
    groupId: new FormControl(),
    groupName: new FormControl()
  });
  groups: Array<Group> = [];
  @ViewChild('groupModal') groupModal: ElementRef;
  constructor(private modalService: NgbModal, private fb: FormBuilder, private groupService: GroupService, private router: Router, private toastr: ToastrServiceService) {
    this.groupForm = fb.group({
      groupId: [0],
      groupName: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.loadGroup();
  }

  get gf() {
    return this.groupForm.controls;
  }

  loadGroup(){
    let input = {
      size: 10,
      index: 1,
      search: '',
      orderBy: '',
      orderByDirection: '',
    }
    this.dtOptions = {
      pagingType: 'simple_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      searching: true,
      language: {
        infoFiltered: ""
      },
      ajax: (dataTablesParameters: any, callback) => {
        input.size = dataTablesParameters.length;
        input.index = dataTablesParameters.start / dataTablesParameters.length;
        input.search = dataTablesParameters.search.value;
        input.orderByDirection = dataTablesParameters.order[0].dir;
        input.orderBy = dataTablesParameters.columns[dataTablesParameters.order[0].column].data;
        input.index++;
        this.groupService.showLoader();
        this.groupService.getAllGroup(input).subscribe((res: any) => {
          if (res.status)
            this.groups = res.data.records;
          else this.toastr.ErrorToastr(res.message)
          callback({
            recordsTotal: res.data.totalCounts,
            recordsFiltered: res.data.totalCounts,
            data: []
          });
          this.groupService.hideLoader();
        }, (err: any) => this.handleApiError(err))
      },
      columns: [{ data: 'groupName', orderable: true }, { data: '', orderable: false }],
      autoWidth: false
    }
  }

  openModal(content: ElementRef) {
    this.modalTitle='Add Group';
    this.resetForm();
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: false });
  }

  saveGroup() {
    if (this.groupForm.valid) {
      let payload = this.groupForm.getRawValue();
      this.groupService.showLoader();
      if (payload.groupId === 0) {

        this.groupService.createGroup(payload).subscribe(res => {
          if (res.status) {
            this.modalService.dismissAll();
            this.toastr.SuccessToastr(res.message);
            $(".table").DataTable().ajax.reload();
          }
          else this.toastr.ErrorToastr(res.message)
          this.groupService.hideLoader();
        }, err => {
          this.handleApiError(err);
        })
      }
      else{
        this.groupService.updateGroup(payload).subscribe(res => {
          if (res.status) {
            this.modalService.dismissAll();
            this.toastr.SuccessToastr(res.message);
            $(".table").DataTable().ajax.reload();
          }
          else this.toastr.ErrorToastr(res.message)
          this.groupService.hideLoader();
        }, err => {
          this.handleApiError(err);
        })
      }
    }
  }

  onUpdateClick(id: number) {
    this.modalTitle='Update Group';
    this.resetForm();
    const group = this.groups.find(m=>m.groupId === id);
    this.groupForm.patchValue(group);
    this.modalService.open(this.groupModal, { ariaLabelledBy: 'modal-basic-title', backdrop: false });
  }

  deleteGroup(id: number) {
    if(confirm("can you delete this group?")){
      this.groupService.showLoader();
      this.groupService.deleteGroup(id).subscribe(res=>{
        if (res.status) {
          this.modalService.dismissAll();
          this.toastr.SuccessToastr(res.message);
          $(".table").DataTable().ajax.reload();
          this.resetForm();
        }
        else this.toastr.ErrorToastr(res.message)
        this.groupService.hideLoader();        
      },(err:any)=>{
        this.handleApiError(err);
      })
    }
  }

  resetForm() {
    this.groupForm.reset();
    this.groupForm.get("groupId").setValue(0);
  }

  handleApiError(err: any) {
    if (err.status == 401) {
      this.router.navigate(['/'])
    }
    else {
      this.toastr.ErrorToastr("Something went wrong");
    }
    this.groupService.hideLoader();
  }

}
