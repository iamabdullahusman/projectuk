import { IfStmt, variable } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { Course } from 'src/app/models/course.model';
import { Intake } from 'src/app/models/intake.model';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { CoursesService } from 'src/app/services/courses.service';
import { EmittService } from 'src/app/Services/emitt.service';
import { IntakeService } from 'src/app/services/intake.service';
import { ToastrServiceService } from 'src/app/services/toastr-service.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.sass']
})
export class CourseComponent implements OnInit {

  formfilter: FormGroup = new FormGroup({

    filtervalue: new FormArray([]),
    searchval: new FormControl()
  })
  searchInput: "";
  isSubmitted: boolean = false;
  modalTitle = 'Add Course';
  dtOptions: DataTables.Settings = {};
  courses: Array<Course> = [];
  course?: Course;
  intakes: Array<Intake> = [];
  courseform: FormGroup = new FormGroup({
    courceName: new FormControl(),
    startDate: new FormControl(),
    endDate: new FormControl(),
    courceId: new FormControl(),
    // intake: new FormArray([])
  })
  constructor(private modalService: NgbModal, private courseService: CoursesService, private intakeSevice: IntakeService, private formBuilder: FormBuilder, private router: Router, private alerts: AlertServiceService, private toastr: ToastrServiceService, private emittService: EmittService) {
    this.courseform = formBuilder.group({
      courceId: ['0'],
      courceName: ['', [Validators.required]],
      // endDate: [(new Date()).getDate()],
      // startDate: [(new Date()).getDate()],
      // intake: formBuilder.array([], [Validators.required])
    })
    emittService.onChangeAddApplicationbtnHideShow(false);
  }

  ngOnInit(): void {
    this.loadCourse();
    this.loadForm();
  }

  get f() {
    return this.courseform.controls;
  }

  loadCourse() {

    $('#loader').show();
    let input = {
      size: 10,
      index: 1,
      search: this.searchInput,
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
        this.courses = [];
        input.size = dataTablesParameters.length;
        input.index = dataTablesParameters.start / dataTablesParameters.length;
        input.search = dataTablesParameters.search.value;
        input.orderByDirection = dataTablesParameters.order[0].dir;
        input.orderBy = dataTablesParameters.columns[dataTablesParameters.order[0].column].data;
        input.index++;

        this.courseService.getAllCourses(input).subscribe(res => {

          if (res.status) {
            for (let i = 0; i < res.data?.records?.length; i++) {
              this.courses.push(res.data.records[i]);
            }
          }
          else {
            this.toastr.ErrorToastr("Something went wrong");
          }

          callback({
            recordsTotal: res.data.totalCounts,
            recordsFiltered: res.data.totalCounts,
            data: []
          });
          $('#loader').hide();
        }, (err: any) => {
          $('#loader').hide();
          if (err.status == 401) {
            this.router.navigate(['/'])
          }
          else {
            this.toastr.ErrorToastr("Something went wrong");
          }
        });
      },
      columns: [{ data: '', orderable: false },
      { data: 'courseName', orderable: true },
      { data: 'startDate', orderable: true },
      { data: 'endDate', orderable: true }],
      autoWidth: false
    }
  }

  loadForm() {
    $('#loader').show();
    let intakeReq = {
      size: 0,
      index: 0
    }
    this.intakeSevice.getAllIntake(intakeReq).subscribe(res => {

      if (res.status) {
        this.intakes = res.data.records;
      }
      else {
        this.toastr.ErrorToastr("Something went wrong");
      }
      $('#loader').hide();
    }, (err: any) => {
      $('#loader').hide();
      if (err.status == 401) {
        this.router.navigate(['/'])
      }
      else {
        this.toastr.ErrorToastr("Something went wrong");
      }
    })
  }

  openModal(content: any, id: any = 0) {

    this.courseform.reset(this.courseform.value);
    if (id > 0) {

      this.modalTitle = 'Update Course';
      this.GetCourse(id);
    }
    else {

      this.course = new Course();
      this.modalTitle = 'Add Course';
      this.resetCourseForm();
    }
    this.isSubmitted = false;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: false });

  }

  resetCourseForm() {
    this.courseform.reset();
    // var chkIntake = this.courseform.get("intake") as FormArray;
    // chkIntake.clear();
    this.courseform.get("courceId")?.setValue('0');
  }

  isShown: boolean = false; // hidden by default
  toggleShow() {

    this.isShown = !this.isShown;

  }

  deleteCourse(id: any) {
    this.alerts.ComfirmAlert("Do you want to delete course?", "Yes", "No").then(res => {
      if (res.isConfirmed) {
        $('#loader').show();
        let deleteInput = {
          id: id
        };
        this.courseService.deleteCourse(deleteInput).subscribe(res => {

          if (res.status) {
            this.toastr.SuccessToastr("Course deleted successfully.");
            $(".table").DataTable().ajax.reload();
          }
          else {
            this.toastr.ErrorToastr(res.message);
          }
          $('#loader').hide();
        },
          (err: any) => {
            $('#loader').hide();
            if (err.status == 401) {
              this.router.navigate(['/']);
            }
            else {
              this.toastr.ErrorToastr("Something went wrong");
            }
          })
      }
    })
  }
  SaveCourse() {
    this.isSubmitted = true;
    if (this.courseform.valid) {
      $('#loader').show();
      var formVal = JSON.parse(JSON.stringify(this.courseform.getRawValue()));
      formVal.courceId = parseInt(formVal.courceId);
      formVal.startDate = new Date();
      formVal.endDate = moment(new Date()).add(1, "years");
      this.courseService.saveCourse(formVal).subscribe(res => {

        if (res.status) {
          this.modalService.dismissAll();
          if (res.data.courceId == 0)
            this.toastr.SuccessToastr("Course added successfully.");
          else
            this.toastr.SuccessToastr("Course updated successfully.");
          $(".table").DataTable().ajax.reload();
        }
        else {
          this.toastr.ErrorToastr("Course is not added.");
        }
        $('#loader').hide();
      }, (err: any) => {
        $('#loader').hide();
        this.toastr.ErrorToastr("Something missing");
      })
    }
  }
  GetCourse(id: any) {

    this.resetCourseForm();
    this.course = this.courses.find(x => x.courseId == id);
    this.courseform.get("courceName")?.setValue(this.course?.courseName);
    this.courseform.get("startDate")?.setValue(moment(this.course?.startDate).format('YYYY-MM-DD'));
    this.courseform.get("endDate")?.setValue(moment(this.course?.endDate).format('YYYY-MM-DD'));
    this.courseform.get("courceId")?.setValue(this.course?.courseId);
    // var chkIntake: FormArray = this.courseform.get('intake') as FormArray;
    // if (this.course?.intakes.length > 0) {
    //   this.course?.intakes.forEach((element: any) => {

    //     chkIntake.controls.push(new FormControl(element.intakeId));
    //   });

    // }
    // else {
    //   chkIntake.clear();
    // }

  }

  FilterUser() {

    let formVal = JSON.stringify(this.formfilter.getRawValue());
    let input = {
      ...JSON.parse(formVal)
    }

    //this.userTypes = this.userTypes;
    this.searchInput = input.searchval;
    // this.loadStudentApplication();
    $(".table").DataTable().ajax.reload();
  }

  StartDate: any;
  StartDateOnChange() {
    this.StartDate = moment(this.f['startDate'].value).format("YYYY-MM-DD");
  }

  // onChangeCheckbox(e: any) {
  //   var chkIntake: FormArray = this.courseform.get('intake') as FormArray;
  //   if (e.target.checked) {
  //     chkIntake.push(new FormControl(parseInt(e.target.value)));
  //   } else {
  //     const index = chkIntake.controls.findIndex(x => x.value === parseInt(e.target.value));
  //     chkIntake.removeAt(index);
  //   }
  // }

  // ischecked(intakeid: any) {
  //   if (this.course?.intakes) {
  //     return this.course.intakes.findIndex((m: any) => m.intakeId == intakeid) >= 0;
  //   }
  //   else
  //     return false;
  // }
}
