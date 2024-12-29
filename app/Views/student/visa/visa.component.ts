import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import moment from "moment";
import { forkJoin } from "rxjs";
import { FileValidationService } from "src/app/Services/file-validation.service";
import { VisaService } from "src/app/Services/visa.service";
import { SessionStorageService } from "src/app/services/session-storage.service";
import { ToastrServiceService } from "src/app/services/toastr-service.service";

@Component({
  selector: "app-visa",
  templateUrl: "./visa.component.html",
  styleUrls: ["./visa.component.sass"],
})
export class VisaComponent implements OnInit {
  Visaform: FormGroup = new FormGroup({
    statusId: new FormControl(),
    applicationUrl: new FormControl(),
    statusDate: new FormControl(),
    reason: new FormControl(),
    fileContent: new FormControl(),
    applicationId: new FormControl(),
  });
  visastatusData: any;
  visadetailsData: any;
  fileError: boolean = false;
  fileData: FormData | null = null;
  selectedFile: File | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private session: SessionStorageService,
    private visaservices: VisaService,
    private toastr: ToastrServiceService,
    private filevalidation: FileValidationService
  ) {
    this.Visaform = formBuilder.group({
      statusId: [1],
      // applicationUrl: ["", Validators.required],
      applicationUrl: [""],
      statusDate: ["", Validators.required],
      reason: [""],
      fileContent: [""],
      applicationId: parseInt(this.session.getUserApplicationId()),
    });
  }

  valuecheck: boolean = false;
  firsttimecheck = true;
  datelabel = "";
  removestar = "*";
  base64FileName: any;
  base64File: any;
  filevalid: false;
  placeholderText: string = 'Enter Corrections'
  removefilevalidation = "*";
  fileName = "";

  ngOnInit(): void {
    this.loadform();
  }
  get f() {
    return this.Visaform.controls;
  }
  Statusvalue: any;
  AfterStatusvalue: any;
  loadform() {
    this.resetPlaceholder();
    let input = {
      applicationId: parseInt(this.session.getUserApplicationId()),
    };
    $("#loader").show();
    let visastatus = this.visaservices.GetVisaHistory(input);
    let visadetails = this.visaservices.GetVisaDetails(input);
    forkJoin([visastatus, visadetails]).subscribe((result) => {
      if (result[0]) {
        if (result[0].status) {
          this.visastatusData = result[0].data;
        } else {
          this.toastr.ErrorToastr(result[0].message);
        }
      }
      if (result[1]) {
        if (result[1].status) {
          this.visadetailsData = result[1].data.visaDetail;

          if (result[1].data.visaDetail == null) {
            console.log("In Reason")
            // if (result[1].data.visaDetail.Reason == null) {
            //   console.log("Not Having reason")
            // }
            // else{
            //   console.log("Having reason")
            // }
            this.firsttimecheck == true;
            // this.Statusvalue = 0;
            this.changestatus(1);
          } else {
            this.changestatus(this.visadetailsData?.visaStatus);
            this.firsttimecheck = false;
            this.Visaform.get("statusId")?.setValue(
              this.visadetailsData?.visaStatus
            );
            this.Visaform.get("applicationUrl")?.setValue(
              this.visadetailsData?.visaApplicationUrl
            );
            if (this.visadetailsData?.visaStatus == 1) {
              this.Visaform.get("statusDate")?.setValue(
                moment(this.visadetailsData?.createdDate).format("YYYY-MM-DD")
              );
              this.Statusvalue = 1;
              this.AfterStatusvalue = 2;
            } else if (this.visadetailsData?.visaStatus == 2) {
              this.Visaform.get("statusDate")?.setValue(
                moment(this.visadetailsData?.updatedDate).format("YYYY-MM-DD")
              );
              this.Statusvalue = 2;
              this.AfterStatusvalue = 3;
            } else if (this.visadetailsData?.visaStatus == 3) {
              this.Visaform.get("statusDate")?.setValue(
                moment(this.visadetailsData?.grantedAt).format("YYYY-MM-DD")
              );
              this.Statusvalue = 3;
              this.AfterStatusvalue = 4;
              
            } else if (this.visadetailsData?.visaStatus == 4) {
           
              this.Visaform.get("statusDate")?.setValue(
                moment(this.visadetailsData?.rejectAt).format("YYYY-MM-DD")
              );
              this.Statusvalue = 4;
              this.AfterStatusvalue = 5;
            } else if (this.visadetailsData?.visaStatus == 5) {
              this.Visaform.get("statusDate")?.setValue(
                moment(this.visadetailsData?.rejectAt).format("YYYY-MM-DD")
              );
              this.Statusvalue = 5;
              this.AfterStatusvalue = 2;
            }

            //this.Visaform.get("reason")?.setValue(this.visadetailsData?.reason);
            this.Visaform.get("fileName")?.setValue(
              this.visadetailsData?.fileUrl
            );
            this.fileName = this.getFileName(this.visadetailsData?.fileUrl);
          }
        } else {
          this.toastr.ErrorToastr(result[1].message);
        }

        
      }


      $("#loader").hide();
    });
    $("#loader").hide();
  }
  getFileName(str: any) {
    if (str) return str.substring(str.lastIndexOf("/") + 1);
    else return "";
  }
  statuValue: any;
  SetDate: any;
  SetGrantedDate: any;
  changestatus(value) {
    console.log("Value is",value)
    this.statuValue = value;
    
    $("#loader").show();
    if (value == 1) {
      if (this.visadetailsData?.createdDate)
        this.Visaform.get("statusDate")?.setValue(
          moment(this.visadetailsData?.createdDate).format("YYYY-MM-DD")
        );
      else
        this.Visaform.get("statusDate")?.setValue(
          moment().format("YYYY-MM-DD")
        );
    } else if (value == 2) {
      this.SetDate = moment().format("YYYY-MM-DD");
      if (this.visadetailsData?.updatedDate)
        this.Visaform.get("statusDate")?.setValue(
          moment(this.visadetailsData?.updatedDate).format("YYYY-MM-DD")
        );
      else this.Visaform.get("statusDate")?.setValue("");
      this.SetGrantedDate = moment(this.visadetailsData?.awaitingDate).format(
        "YYYY-MM-DD"
      );
    } else if (value == 3) {
      if (this.visadetailsData?.grantedAt)
        this.Visaform.get("statusDate")?.setValue(
          moment(this.visadetailsData?.grantedAt).format("YYYY-MM-DD")
        );
      else this.Visaform.get("statusDate")?.setValue("");

      this.SetGrantedDate = moment(this.visadetailsData?.scheculeDate).format(
        "YYYY-MM-DD"
      );
    } else if (value == 4) {
      
      if (this.visadetailsData?.rejectAt)
        this.Visaform.get("statusDate")?.setValue(
          moment(this.visadetailsData?.rejectAt).format("YYYY-MM-DD")
        );
      else this.Visaform.get("statusDate")?.setValue("");

      this.SetGrantedDate = moment(this.visadetailsData?.scheculeDate).format(
        "YYYY-MM-DD"
      );
    } else if (value == 5) {
      if (this.visadetailsData?.rejectAt)
        this.Visaform.get("statusDate")?.setValue(
          moment(this.visadetailsData?.rejectAt).format("YYYY-MM-DD")
        );
      else this.Visaform.get("statusDate")?.setValue("");
    }

    


    if (value == "1" || value == 1) {

      

      this.valuecheck = false;
      this.removestar = "";
      this.datelabel = "Applied Date";
      this.removefilevalidation = "";
      this.Visaform.get("statusDate")?.clearValidators();
      this.Visaform.get("reason")?.clearValidators();
      this.Visaform.get("fileContent")?.clearValidators();
      this.Visaform.updateValueAndValidity();   

      // this.Visaform.get("applicationUrl")?.addValidators(Validators.required);
      this.Visaform.get("applicationUrl");
    } else if (value == "2" || value == 2) {
      this.valuecheck = true;
      this.datelabel = "Submission Date";
      this.removestar = "";
      this.removefilevalidation = "";
      this.Visaform.get("applicationUrl").clearValidators();
      this.Visaform.get("reason").clearValidators();
      this.Visaform.updateValueAndValidity();
      this.Visaform.get("fileContent").clearValidators();
      this.Visaform.get("fileContent").updateValueAndValidity();
      this.Visaform.get("statusDate").addValidators(Validators.required);
    } else if (value == "3" || value == 3) {
      this.datelabel = "Granted Date";
      this.removestar = "";
      this.removefilevalidation = "";
      this.valuecheck = true;
      this.Visaform.get("applicationUrl").clearValidators();
      this.Visaform.get("reason").clearValidators();
      this.Visaform.updateValueAndValidity();
      this.Visaform.get("statusDate").addValidators(Validators.required);
    } else if (value == "4" || value == 4) {
      this.valuecheck = true;
      this.datelabel = "Refused Date";
      this.removestar = "*";
      this.removefilevalidation = "*";
      this.Visaform.get("applicationUrl").clearValidators();
      this.Visaform.get("applicationUrl").updateValueAndValidity();
      this.Visaform.get("statusDate").addValidators(Validators.required);
      this.Visaform.get("reason").addValidators(Validators.required);
      this.Visaform.get("fileContent").addValidators(Validators.required);
      this.Visaform.get("fileContent").updateValueAndValidity();
    } else {
      console.log(value ,"<=value")
      this.valuecheck = true;
      this.removestar = "*";
      this.datelabel = "Rejected Date";
      this.removefilevalidation = "*";
      this.Visaform.get("applicationUrl").clearValidators();
      this.Visaform.get("reason").clearValidators();
      this.Visaform.get("fileContent").clearValidators();
      this.Visaform.get("reason").updateValueAndValidity();
      this.Visaform.get("applicationUrl").updateValueAndValidity();
      this.Visaform.get("fileContent").updateValueAndValidity();
      this.Visaform.get("statusDate").addValidators(Validators.required);
    }
    
    $("#loader").hide();
  }
  SelectVisa(event: any) {
    const file = event.target.files[0];
    if (this.filevalidation.checkFileType(event.target.files)) {
      const reader = new FileReader();
      reader.onloadend = this._handleReaderLoaded.bind(this);
      reader.readAsDataURL(file);

      this.base64FileName = file.name;
    } else this.filevalid = false;
  }

  _handleReaderLoaded(e: any) {
    let reader = e.target;
    var base64result = reader.result.substr(reader.result.indexOf(",") + 1);
    this.base64File = base64result;
    this.Visaform.get("fileContent").setValue(this.base64File);
  }
  resetPlaceholder(){
    this.placeholderText = 'Enter the Reason for Status Change';
  }
  isSubmitted = false;
  saveVisaform() {
    this.isSubmitted = true;
    console.log("Visa Form", this.Visaform)
    
    if (this.Visaform.valid) {
      $("#loader").show();
      let formVal = JSON.stringify(this.Visaform.getRawValue());
      let serviceInput = {
        ...JSON.parse(formVal),
      };
      if (serviceInput.statusId == 1) {
        this.Visaform.get("statusDate")?.clearValidators();
        this.Visaform.get("reason")?.clearValidators();

        this.Visaform.get("fileContent")?.clearValidators();
        this.Visaform.updateValueAndValidity();
        // this.Visaform.get("applicationUrl")?.addValidators(Validators.required);
        this.Visaform.get("applicationUrl");
      }
      let saveVisaformFormData = new FormData();
      saveVisaformFormData.append("applicationId", serviceInput.applicationId);
      saveVisaformFormData.append(
        "applicationUrl",
        serviceInput.applicationUrl
      );
      saveVisaformFormData.append("reason", serviceInput.reason);
      saveVisaformFormData.append("statusDate", serviceInput.statusDate);
      saveVisaformFormData.append("statusId", serviceInput.statusId);

      if (this.selectedFile) {
        saveVisaformFormData.append(
          "PDF",
          this.selectedFile,
          this.selectedFile.name
        );
      }

      this.visaservices
        .ChangeVisaStatus(saveVisaformFormData)
        .subscribe((res) => {
          console.log("Response of visa:", res);
          if (res.status) {
            this.toastr.SuccessToastr("Visa Status Change successfully.");
            this.loadform();

            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } else {

            this.toastr.SuccessToastr("Visa Status Change successfully.");
            //this.toastr.ErrorToastr("Something went wrong badly");
            this.loadform();

          }
          $("#loader").hide();
        });   
    }
  }
  onFileChange(event: any) {
    const file: File = event.target.files[0];
    this.selectedFile = file;
    console.log("Selected file:", this.selectedFile);
    if (file) {
      if (file.type === "application/pdf") {
        this.selectedFile = file;
        alert("Successfully selected file");
      } else {
        alert("This is the wrong file type. Please select a PDF.");
        event.target.value = ""; // Clear the file input
      }
    }
  }
}
