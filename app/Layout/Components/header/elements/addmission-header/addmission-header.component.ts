import { Component, OnInit } from "@angular/core";
import { forkJoin } from "rxjs";
import { AccountService } from "src/app/Services/account.service";
import { EmittService } from "src/app/Services/emitt.service";
import { CampusService } from "src/app/services/campus.service";
import { IntakeService } from "src/app/services/intake.service";
import { ToastrServiceService } from "src/app/services/toastr-service.service";

@Component({
  selector: "app-addmission-header",
  templateUrl: "./addmission-header.component.html",
  styleUrls: ["./addmission-header.component.sass"],
})
export class AddmissionHeaderComponent implements OnInit {
  intakes = [];
  campuses = [];
  selectedCampus = "0";
  selectedIntake = "0";
  filtername = "";
  constructor(private iServices: IntakeService,
    private cServices: CampusService,
    private toastr: ToastrServiceService,
    private emitService: EmittService,
    private accountService: AccountService,
  ) {}

  ngOnInit(): void {
    this.loadForm();
  }

  loadForm() {
    $("#loader").show();
    let paginationInput = {
      index: 0,
      size: 0,
    };
    var getIntakes = this.iServices.getAllIntake(paginationInput);
    var getCampuses = this.cServices.getAllCampaus(paginationInput);
    var getUserFilters = this.accountService.getUserFilters();
    forkJoin([getIntakes, getCampuses, getUserFilters]).subscribe((result) => {
      if (result[0]) {
        if (result[0].status) {
          this.intakes = result[0].data.records;
        } else {
          this.toastr.ErrorToastr(result[0].message);
        }
      }
      if (result[1]) {
        if (result[1].status) {
          this.campuses = result[1].data.records;
          this.campuses.unshift({
            campusId: 0,
            campusName: "All",
          });
        } else {
          this.toastr.ErrorToastr("Something went wrong");
        }
      }
      if (result[2]) {
        if (result[2].status) {
          if (
            result[2].data == null ||
            result[2].data.intakeId == "" ||
            result[2].data.intakeId == "0" ||
            result[2].data.intakeId == 0
          ) {
            var today = new Date();
            var flag = false;

            this.intakes.forEach((element) => {
              var start = new Date(element.startDate);
              var end = new Date(element.startDate);


            // using flag to stop entering the if condition if selected intake is already selected
              if (start < today  && !flag) {
                this.selectedIntake = element.intakeId;
                flag = true;
              }
            });
            if (flag == false) {
              var intake = this.intakes[0];
              this.selectedIntake = this.intakes[0].intakeId;
              for (let i = 0; i < this.intakes.length; i++) {
                var previous = new Date(intake.startDate);
                var next = new Date(this.intakes[i].startDate);
                if (previous < next) {
                  intake = this.intakes[i];
                  this.selectedIntake = this.intakes[i].intakeId;
                }
              }
            }
          } else {
            this.selectedIntake = result[2].data.intakeId;
          }
          if (result[2].data == null || result[2].data.campusId) {
            this.selectedCampus = this.campuses[0].campusId;
          } else {
            this.selectedCampus = result[2].data.campusId;
          }
          sessionStorage.setItem("IntakeId", this.selectedIntake);
          sessionStorage.setItem("CampusId", this.selectedCampus);
        } else {
          this.toastr.ErrorToastr("Something went wrong");
        }
      }
    });
  }

  onChange() {
    let input = {
      intakeId: parseInt(this.selectedIntake.toString()),
      campusId: parseInt(this.selectedCampus.toString()),
      name: this.filtername,
    };
    sessionStorage.setItem("IntakeId", this.selectedIntake);
    sessionStorage.setItem("CampusId", this.selectedCampus);

    this.emitService.onChangeCampusIntake(input);
  }
}
