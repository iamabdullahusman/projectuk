import {
  ChangeDetectorRef,
  AbstractType,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
} from "@angular/core";
import intlTelInput from 'intl-tel-input';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { levenshtein } from "fast-levenshtein";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import moment from "moment";
import { forkJoin } from "rxjs";
import { Campus } from "src/app/models/campus.model";
import { Country } from "src/app/Models/country.model";
import { Course } from "src/app/models/course.model";
import { FeePayOption } from "src/app/models/fee-pay-option.model";
import { Intake } from "src/app/models/intake.model";
import { SocialPreference } from "src/app/models/social-preference.model";
import { VisaType } from "src/app/Models/visa-type.model";
import { AccountService } from "src/app/Services/account.service";
import { AlertServiceService } from "src/app/Services/alert-service.service";
import { ApplicationService } from "src/app/services/application.service";
import { CampusService } from "src/app/services/campus.service";
import { CoursesService } from "src/app/services/courses.service";
import { CustomValidationService } from "src/app/Services/custom-validation.service";
import { EmittService } from "src/app/Services/emitt.service";
import { FeePayByService } from "src/app/Services/feepayby.service";
import { IntakeService } from "src/app/services/intake.service";
import { SocialreferenceService } from "src/app/services/socialreference.service";
import { ToastrServiceService } from "src/app/Services/toastr-service.service";
import { UserInquiryService } from "src/app/services/user-inquiry.service";
import { VisaService } from "src/app/Services/visa.service";
import { UnivercityService } from "src/app/Services/univercity.service";
import { SponcerService } from "src/app/Services/sponcer.service";
import dayjs from "dayjs";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
})
export class FooterComponent implements OnInit  {
  
  selectedCountryCode: string;
  selectedParentCountryCode: string;
  isShowAddApplicationBtn = false;
  isSubmitted = false;
  currentStep = 0;
  courses: Array<Course> = [];
  intakes: Array<Intake> = [];
  campuses: Array<Campus> = [];
  visaTypes: Array<VisaType> = [];
  feePayOptions: Array<FeePayOption> = [];
  SocialPreferences: Array<SocialPreference> = [];
  completionYears: Array<number> = [];
  dateofStudies: Array<string> = [];
  isFirstStepCompleted = false;
  isSecondStepCompleted = false;
  isThirdStepCompleted = false;
  // isFourthtStepCompleted = false;
  modaltitle = "Add Application";
  @ViewChild("applicationModal") applicationModal: ElementRef;
  @ViewChild("LinkInquiry") LinkInquiry: ElementRef;
  
  @ViewChild('phoneInput') phoneInput!: ElementRef;
  @ViewChild('parentPhoneInput') parentPhoneInput!: ElementRef;
  applicationID: number = 0;
  applicationStatus: number = 0;
  applicationStage: number = 0;
  IsUploadDocument: boolean;
  QualificationDocs = [];
  PassPortDocs = [];
  IELTSDocs = [];
  nationalitydata: Array<Country> = [];
  coutryofresidentdata: Array<Country> = [];
  medicalCondition: boolean;

  Applicationform: FormGroup = new FormGroup({
    applicationSource: new FormControl(),
    applicationStatus: new FormControl(),
    visaTypeDetail: new FormControl(),
    visaType: new FormControl(),
    hasVisa: new FormControl(),
    medicalConditionDetail: new FormControl(),
    hasExistMedicalCondition: new FormControl(),
    socialRefrenceTypeDetails: new FormControl(),
    socialRefrenceType: new FormControl(),
    feePaybyDetail: new FormControl(),
    feePayby: new FormControl(),
    // schoolCompletionYear: new FormControl(),
    // secondarySchoolName: new FormControl(),
    lastSchoolQualification: new FormControl(),
    // suggestedUniversity: new FormControl(),
    studyLocation: new FormControl(),
    courseName: new FormControl(),
    intake: new FormControl(),
    //dateOfStudy: new FormControl(),
    parentEmail: new FormControl(),
    parentPhoneNo: new FormControl(),
    parentCountryCode: new FormControl(),
    parentLastName: new FormControl(),
    parentFirstName: new FormControl(),
    applicationId: new FormControl(),
    firstName: new FormControl(),
    lastName: new FormControl(),
    email: new FormControl(),
    phoneNo: new FormControl(),
    countryCode: new FormControl(),
    dateOfBirth: new FormControl(),
    nationality: new FormControl(),
    countryOfResident: new FormControl(),
    // adress: new FormControl(),
    InquiryId: new FormControl(),
    applicationStatusName: new FormControl(),
    applicationStage: new FormControl(),
    sponsorId: new FormControl(),
  });
  // Array of country codes
  countryCodes = [
    { name: 'US (United States)', dial_code: '+1' },
    { name: 'UK (United Kingdom)', dial_code: '+44' },
    { name: 'IN (India)', dial_code: '+91' },
    { name: 'AU (Australia)', dial_code: '+61' },
    { name: 'CA (Canada)', dial_code: '+1' },
    { name: 'PK (Pakistan)', dial_code: '+92' },
    { name: 'DE (Germany)', dial_code: '+49' },
    { name: 'FR (France)', dial_code: '+33' },
    { name: 'JP (Japan)', dial_code: '+81' },
    { name: 'BR (Brazil)', dial_code: '+55' },
    { name: 'CN (China)', dial_code: '+86' },
    { name: 'ZA (South Africa)', dial_code: '+27' },
    { name: 'MX (Mexico)', dial_code: '+52' },
    { name: 'SA (Saudi Arabia)', dial_code: '+966' },
    { name: 'AE (United Arab Emirates)', dial_code: '+971' },
    { name: 'RU (Russia)', dial_code: '+7' },
    { name: 'IT (Italy)', dial_code: '+39' },
    { name: 'ES (Spain)', dial_code: '+34' },
    { name: 'TR (Turkey)', dial_code: '+90' },
    { name: 'KR (South Korea)', dial_code: '+82' },
    { name: 'ID (Indonesia)', dial_code: '+62' },
    { name: 'NG (Nigeria)', dial_code: '+234' },
    { name: 'EG (Egypt)', dial_code: '+20' },
    { name: 'BD (Bangladesh)', dial_code: '+880' },
    { name: 'AR (Argentina)', dial_code: '+54' },
    { name: 'MY (Malaysia)', dial_code: '+60' },
    { name: 'SG (Singapore)', dial_code: '+65' },
    { name: 'PH (Philippines)', dial_code: '+63' },
    { name: 'VN (Vietnam)', dial_code: '+84' },
    { name: 'TH (Thailand)', dial_code: '+66' },
    { name: 'NZ (New Zealand)', dial_code: '+64' },
    { name: 'SE (Sweden)', dial_code: '+46' },
    { name: 'NO (Norway)', dial_code: '+47' },
    { name: 'DK (Denmark)', dial_code: '+45' },
    { name: 'NL (Netherlands)', dial_code: '+31' },
    { name: 'CH (Switzerland)', dial_code: '+41' },
    { name: 'IE (Ireland)', dial_code: '+353' },
    { name: 'AT (Austria)', dial_code: '+43' },
    { name: 'PT (Portugal)', dial_code: '+351' },
    { name: 'BE (Belgium)', dial_code: '+32' },
    { name: 'FI (Finland)', dial_code: '+358' },
    { name: 'GR (Greece)', dial_code: '+30' },
    { name: 'CZ (Czech Republic)', dial_code: '+420' },
    { name: 'PL (Poland)', dial_code: '+48' },
    { name: 'CL (Chile)', dial_code: '+56' },
    { name: 'CO (Colombia)', dial_code: '+57' },
    { name: 'VE (Venezuela)', dial_code: '+58' },
    { name: 'PE (Peru)', dial_code: '+51' },
    { name: 'IL (Israel)', dial_code: '+972' },
    { name: 'KW (Kuwait)', dial_code: '+965' },
    { name: 'QA (Qatar)', dial_code: '+974' },
    { name: 'BH (Bahrain)', dial_code: '+973' },
    { name: 'OM (Oman)', dial_code: '+968' },
    { name: 'IQ (Iraq)', dial_code: '+964' },
    { name: 'AF (Afghanistan)', dial_code: '+93' },
    { name: 'LK (Sri Lanka)', dial_code: '+94' },
    { name: 'MV (Maldives)', dial_code: '+960' },
    { name: 'NP (Nepal)', dial_code: '+977' },
    { name: 'MM (Myanmar)', dial_code: '+95' },
    { name: 'KH (Cambodia)', dial_code: '+855' },
    { name: 'HK (Hong Kong)', dial_code: '+852' },
    { name: 'TW (Taiwan)', dial_code: '+886' },
    { name: 'AL (Albania)', dial_code: '+355' },
    { name: 'DZ (Algeria)', dial_code: '+213' },
    { name: 'AD (Andorra)', dial_code: '+376' },
    { name: 'AO (Angola)', dial_code: '+244' },
    { name: 'AG (Antigua and Barbuda)', dial_code: '+1-268' },
    { name: 'AM (Armenia)', dial_code: '+374' },
    { name: 'AZ (Azerbaijan)', dial_code: '+994' },
    { name: 'BS (Bahamas)', dial_code: '+1-242' },
    { name: 'BB (Barbados)', dial_code: '+1-246' },
    { name: 'BY (Belarus)', dial_code: '+375' },
    { name: 'BT (Bhutan)', dial_code: '+975' },
    { name: 'BO (Bolivia)', dial_code: '+591' },
    { name: 'BA (Bosnia and Herzegovina)', dial_code: '+387' },
    { name: 'BW (Botswana)', dial_code: '+267' },
    { name: 'BN (Brunei)', dial_code: '+673' },
    { name: 'BF (Burkina Faso)', dial_code: '+226' },
    { name: 'BI (Burundi)', dial_code: '+257' },
    { name: 'CV (Cape Verde)', dial_code: '+238' },
    { name: 'CM (Cameroon)', dial_code: '+237' },
    { name: 'CF (Central African Republic)', dial_code: '+236' },
    { name: 'TD (Chad)', dial_code: '+235' },
    { name: 'KM (Comoros)', dial_code: '+269' },
    { name: 'CG (Congo)', dial_code: '+242' },
    { name: 'CU (Cuba)', dial_code: '+53' },
    { name: 'DJ (Djibouti)', dial_code: '+253' },
    { name: 'DM (Dominica)', dial_code: '+1-767' },
    { name: 'DO (Dominican Republic)', dial_code: '+1-809' },
    { name: 'EC (Ecuador)', dial_code: '+593' },
    { name: 'SV (El Salvador)', dial_code: '+503' },
    { name: 'GQ (Equatorial Guinea)', dial_code: '+240' },
    { name: 'ER (Eritrea)', dial_code: '+291' },
    { name: 'EE (Estonia)', dial_code: '+372' },
    { name: 'SZ (Eswatini)', dial_code: '+268' },
    { name: 'ET (Ethiopia)', dial_code: '+251' },
    { name: 'FJ (Fiji)', dial_code: '+679' },
    { name: 'GA (Gabon)', dial_code: '+241' },
    { name: 'GM (Gambia)', dial_code: '+220' },
    { name: 'GE (Georgia)', dial_code: '+995' },
    { name: 'GH (Ghana)', dial_code: '+233' },
    { name: 'GD (Grenada)', dial_code: '+1-473' },
    { name: 'GT (Guatemala)', dial_code: '+502' },
    { name: 'GN (Guinea)', dial_code: '+224' },
    { name: 'GW (Guinea-Bissau)', dial_code: '+245' },
    { name: 'GY (Guyana)', dial_code: '+592' },
    { name: 'HT (Haiti)', dial_code: '+509' },
    { name: 'HN (Honduras)', dial_code: '+504' },
    { name: 'IS (Iceland)', dial_code: '+354' },
    { name: 'CI (Ivory Coast)', dial_code: '+225' },
    { name: 'JM (Jamaica)', dial_code: '+1-876' },
    { name: 'JO (Jordan)', dial_code: '+962' },
    { name: 'KZ (Kazakhstan)', dial_code: '+7' },
    { name: 'KE (Kenya)', dial_code: '+254' },
    { name: 'XK (Kosovo)', dial_code: '+383' },
    { name: 'LA (Laos)', dial_code: '+856' },
    { name: 'LV (Latvia)', dial_code: '+371' },
    { name: 'LB (Lebanon)', dial_code: '+961' },
    { name: 'LS (Lesotho)', dial_code: '+266' },
    { name: 'LR (Liberia)', dial_code: '+231' },
    { name: 'LY (Libya)', dial_code: '+218' },
    { name: 'LI (Liechtenstein)', dial_code: '+423' },
    // Add more countries as needed
  ];
  SponcerForm: FormGroup = new FormGroup({
    sponsorId: new FormControl(),
    FirstName: new FormControl(),
    LastName: new FormControl(),
    AuthorizedPersonName: new FormControl(),
    EmailId: new FormControl(),
    CountryId: new FormControl(),
    CityId: new FormControl(),
    Address: new FormControl(),
    PostalCode: new FormControl(),
    ContactDetail: new FormControl(),
  });
  LinkInquiryForm: FormGroup = new FormGroup({
    inquiryId: new FormControl(),
  });
  requestFrom = "";
  @ViewChild("SponcerModal") SponcerModal: ElementRef;
  constructor(
    private cd: ChangeDetectorRef,
    private campusService: CampusService,
    private Univercity: UnivercityService,
    private sponcerServices: SponcerService,
    private userInquiryService: UserInquiryService,
    private intakeService: IntakeService,
    private courseService: CoursesService,
    private feepayService: FeePayByService,
    private modalService: NgbModal,
    private toastr: ToastrServiceService,
    private formBuilder: FormBuilder,
    private socialReferanceService: SocialreferenceService,
    private route: Router,
    private visaService: VisaService,
    private applicationService: ApplicationService,
    private emittService: EmittService,
    private accountservices: AccountService,
    private alerts: AlertServiceService,
    private customValidator: CustomValidationService
  ) {
    this.Applicationform = formBuilder.group(
      {
        applicationSource: [null],
        applicationStatus: [null],
        visaTypeDetail: [null],
        visaType: [null],
        hasVisa: [null],
        sponsorId: [null],
        medicalConditionDetail: [null],
        hasExistMedicalCondition: [null],
        socialRefrenceTypeDetails: [null],
        socialRefrenceType: [null],
        feePaybyDetail: [null],
        feePayby: [null],
        // schoolCompletionYear: [null],
        // secondarySchoolName: [null],
        lastSchoolQualification: [null],
        // suggestedUniversity: [null],
        studyLocation: [null],
        courseName: [null],
        intake: [null],
        //dateOfStudy: [null],
        parentEmail: [null],
        parentPhoneNo: [null],
        parentCountryCode:[null],
        parentLastName: [null],
        parentFirstName: [null],
        applicationId: ["0"],
        firstName: [null],
        lastName: [null],
        email: [null],
        countryCode: [this.countryCodes[0]?.dial_code || '', Validators.required],
        phoneNo: [null, Validators.pattern("^[^0][0-9]{9,11}$")],
        dateOfBirth: [null],
        nationality: [null],
        countryOfResident: [null],
        // adress: [null],
        applicationStage: [null],
        InquiryId: [0],
        acceptTerms: [false],
      },
      {
        validator: this.customValidator.CompareMailId("email", "parentEmail"),
      }
    );
    this.selectedCountryCode = this.Applicationform.get('countryCode')?.value || '';
    this.selectedParentCountryCode = this.Applicationform.get('countryCode')?.value || '';
    this.LinkInquiryForm = formBuilder.group({
      inquiryId: [0],
    });
    this.SponcerForm = formBuilder.group({
      sponsorId: [0, [Validators.required]],
      SponcerName: ["Other", [Validators.required]],
      FirstName: ["", [Validators.required]],
      LastName: ["", [Validators.required]],
      AuthorizedPersonName: ["", [Validators.required]],
      SponcerType: [0, [Validators.required]],
      EmailId: [
        "",
        [
          Validators.required,
          Validators.pattern("[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}"),
        ],
      ],
      CountryId: ['', [Validators.required]],
      CityId: ['', [Validators.required]],
      Address: ["", [Validators.required]],
      PostalCode: [
        "",
        [Validators.required, Validators.pattern("[A-Za-z0-9]{5,}")],
      ],
      ContactDetail: [
        "",
        [Validators.required, Validators.pattern("[0-9]{10,12}")],
      ],
    });
    this.isShowAddApplicationBtn = false;
    emittService.getApplicationId().subscribe((res) => {
      if (res.action == "edit") {
        this.requestFrom = res.page;
        this.applicationID = parseInt(res.id);
        this.modaltitle = "Update Application";
        let input = {
          id: this.applicationID,
        };
        this.applicationService.getApplicationById(input).subscribe(
          (res) => {
            console.log("Application Data: ", res.data);
            this.QualificationDocs = [];
            this.PassPortDocs = [];
            this.IELTSDocs = [];
            this.currentStep = 1;
            this.isFirstStepCompleted = false;
            this.isSecondStepCompleted = false;
            this.isThirdStepCompleted = false;
           
            // this.isFourthtStepCompleted = false;
            if (res.data.visaType == 9) {
              this.IsvisaTypeDetail = true;
            } else {
              this.IsvisaTypeDetail = false;
            }
            if (res.data.applicationStage == 0) {
              // this.isFourthtStepCompleted = true;
              this.isThirdStepCompleted = true;
              this.isSecondStepCompleted = true;
              this.isFirstStepCompleted = true;
            } else {
              if (res.data.applicationStage >= 1) {
                this.isFirstStepCompleted = true;
              }
              if (res.data.applicationStage >= 2) {
                this.isSecondStepCompleted = true;
                this.currentStep = 3;
              }
              if (res.data.applicationStage >= 3) {
                this.isThirdStepCompleted = true;
                this.currentStep = 3;
              }
              if (res.data.applicationStage == 4) {
                this.currentStep = 1;
                // this.isFourthtStepCompleted = true;
              }
            }
            this.applicationStatus = res.data.applicationStatus;
            this.applicationStage = res.data.applicationStage;
            res.data.courseName =
              res.data.courseName == 0 ? null : res.data.courseName;
            res.data.studyLocation =
              res.data.studyLocation == 0 ? null : res.data.studyLocation;
            res.data.intake = res.data.intake == 0 ? null : res.data.intake;
            res.data.feePayby =
              res.data.feePayby == 0 ? null : res.data.feePayby;
            res.data.visaType =
              res.data.visaType == 0 ? null : res.data.visaType;
            res.data.socialRefrenceType =
              res.data.socialRefrenceType == null
                ? null
                : res.data.socialRefrenceType;
            this.medicalCondition = res.data.hasExistMedicalCondition;
            this.IsUploadDocument = res.data.isUploadDocument;
            this.Applicationform.reset();
            this.isSubmitted = false;
            this.Applicationform.patchValue(res.data);
            this.ChangeFeepay();

            if (res.data.dateOfBirth)
              this.Applicationform.controls.dateOfBirth.setValue(
                dayjs(res.data.dateOfBirth).format("YYYY-MM-DD")
              );
            if (res.data.parentEmail) {
              this.Applicationform.get("parentEmail").disable();
            } else {
              this.Applicationform.get("parentEmail").enable();
            }

            if (res.data.email) {
              this.Applicationform.get("email").disable();
            } else {
              this.Applicationform.get("email").enable();
            }

            this.Applicationform.get("InquiryId").setValue(0);
            this.removeValidation();
            this.Applicationform.markAsUntouched();
            if (this.currentStep == 1) {
              this.setp1Validation();
              this.Applicationform.get("applicationStage").setValue("1");
            }
            if (this.currentStep == 2) {
              this.Applicationform.get("applicationStage").setValue("2");
              this.step2Validation();
            }
            if (this.currentStep == 3) {
              this.Applicationform.get("applicationStage").setValue("4");
              this.step3Validation();
            }
            this.modalService.open(this.applicationModal, {
              ariaLabelledBy: "modal-basic-title",
              modalDialogClass: "application-dialog h-100 my-0 me-0 ",
              backdrop: false,
            });
            setTimeout(() => {
              const inputElement = document.getElementById('phoneInputId') as HTMLInputElement;
              if (inputElement) {
                const iti = intlTelInput(inputElement, {
                  initialCountry: "us",
                  separateDialCode: true,
                  utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
                });
                inputElement.addEventListener("countrychange", () => {
                  const selectedCountryData = iti.getSelectedCountryData();
                  const countryCode = selectedCountryData.dialCode; 
                  console.log("Selected country code:", countryCode);
          
                 
                  this.Applicationform.get("countryCode").setValue(countryCode);
                });
              } else {
                console.error("Input element not found.");
              }
               
            },100)

          },
          (err: any) => {
            this.toastr.ErrorToastr("Something went wrong");
            console.error(err);
          }
        );
      } else if (res.action == "add") {
        this.Applicationform.get("parentEmail").enable();
        this.Applicationform.get("email").enable();
        let input = {
          Id: parseInt(res.inquiryId),
        };
        this.Applicationform.get("InquiryId").setValue(0);
        if (res.inquiryId) {
          this.userInquiryService
            .InquirytoApplicationConvert(input)
            .subscribe((res1) => {
              if (res1.status) {
                $("#loader").hide();
                this.Applicationform.patchValue(res1.data);
                this.ChangeFeepay();
                if (res1.data.dateOfBirth)
                  this.Applicationform.controls.dateOfBirth.setValue(
                    dayjs(res1.data.dateOfBirth).format("YYYY-MM-DD")
                  );
                this.Applicationform.get("InquiryId").setValue(
                  parseInt(res.inquiryId)
                );
                $(".table").DataTable().ajax.reload();
              } else {
                this.toastr.ErrorToastr(res1.message);
                $("#loader").hide();
              }
            });
        }
        this.openModal();
      }
    });
   
  }
  todaydate: any;

  public noWhitespaceValidator(control: FormControl) {
    return (control?.value || "")?.trim().length ? null : { whitespace: true };
  }

  Countrydata: any = [];
  citydata: any = [];
  loadcountrydata() {
    let CountryId = this.accountservices.getCountries();
    forkJoin([CountryId]).subscribe((result) => {
      $("#loader").hide();
      if (result[0]) {
        if (result[0].status) {
          this.Countrydata = result[0].data;
        } else {
          this.toastr.ErrorToastr(result[0].message);
        }
      }
      $("#loader").hide();
    });
  }
  changeContry(cityId: any) {
    $("#loader").show();
    this.SponcerForm.get("CityId").setValue("");
    let input = {
      id: this.SponcerForm.get("CountryId").value,
    };
    this.accountservices.getCitiesByCountryId(input).subscribe(
      (res) => {
        if (res.status) {
          this.citydata = res.data;
        } else {
          this.toastr.ErrorToastr(res.message);
        }
        $("#loader").hide();
      },
      (err: any) => {
        $("#loader").hide();
        this.toastr.ErrorToastr("Something went wrong");
        console.log(err);
      }
    );
  }

  
  ngOnInit() {
    this.loadForm();
    this.todaydate = moment(new Date()).format("YYYY-MM-DD");
    this.GetUniversity();
    this.loadcountrydata();
    // Promise. resolve().then(()=>{
    //   console.log(" Foorter compnent");
      
    //     const inputElement = document.querySelector("#phone5656565")as HTMLInputElement ;
    //     console.log("inputElement:", inputElement);
  
    //     if (inputElement) {
    //       console.log("into the function")
    //       intlTelInput(inputElement, {
    //         initialCountry: 'us',
    //         separateDialCode: true,
    //         utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js'
    //       });
    //     } else {
    //       console.error("Input element with ID 'phone5656565' not found.");
    //     }})
  }
  get f() {
    return this.Applicationform.controls;
  }
  get fsponcer() {
    return this.SponcerForm.controls;
  }
  get fl() {
    return this.LinkInquiryForm.controls;
  }
  modalObj: any;
  
  
  openModal() {
    // if (this.modalObj) {
    //   this.closeModal();
    // }
    console.log("Modal opened");
    
    this.QualificationDocs = [];
    this.PassPortDocs = [];
    this.IELTSDocs = [];

    this.modaltitle = "Add Application";
  
    this.currentStep = 1;
    
    this.isFirstStepCompleted = false;
    this.isSecondStepCompleted = false;
    this.isThirdStepCompleted = false;
    // this.isFourthtStepCompleted = false;
    this.applicationID = 0;
    this.applicationStatus = 0;
    this.applicationStage = 0;
    this.isSubmitted = false;
    // this.Applicationform.reset();
    this.removeValidation();
    this.Applicationform.reset();
    
    // this.setp1Validation();
    this.Applicationform.get("applicationStatus").setValue("2");
    this.Applicationform.get("applicationId").setValue("0");
    this.Applicationform.get("applicationStage").setValue("1");
    this.requestFrom = "application";
     // Close the modal if it's already open
  if (this.modalObj) {
    this.modalObj.close();
    console.log("close modal");
  }
 
    
    this.modalObj = this.modalService.open(this.applicationModal, {
      ariaLabelledBy: "modal-basic-title",
      modalDialogClass: "application-dialog h-100 my-0 me-0",
      
    });
    this.modalObj.result.then(
      () => {
        console.log('Modal closed');
      },
      () => {
        console.log('Modal dismissed');
      }
    );

    // Wait for the modal to open before initializing intl-tel-input
    setTimeout(() => {
      const inputElement = document.getElementById('phoneInputId') as HTMLInputElement;
      if (inputElement) {
        const iti = intlTelInput(inputElement, {
          initialCountry: "us",
          separateDialCode: true,
          utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
        });
        inputElement.addEventListener("countrychange", () => {
          const selectedCountryData = iti.getSelectedCountryData();
          const countryCode = selectedCountryData.dialCode; 
          console.log("Selected country code:", countryCode);
  
         
          this.Applicationform.get("countryCode").setValue(countryCode);
        });
      } else {
        console.error("Input element not found.");
      }
        
    const inputElementA = document.getElementById('parentPhoneInputId') as HTMLInputElement;
    if (inputElementA) {
      const itiParentPhone = intlTelInput(inputElementA, {
        initialCountry: "us",
        separateDialCode: true,
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
      });
      inputElementA.addEventListener("countrychange", () => {
        const selectedCountryData = itiParentPhone.getSelectedCountryData();
        const parentCountryCode = selectedCountryData.dialCode;
        console.log("Selected country code for parentPhoneNo:", parentCountryCode);

       
        this.Applicationform.get("parentCountryCode").setValue(parentCountryCode);
      });
    } else {
      console.error("parentPhoneInput element not found.");
    }
       
    },100)
   


  }
  // closeModal() {
  //   this.modalService.close(this.modalObj);
  //   this.modalObj = undefined;
  // }
 

  loadForm() {
    let paginationModal = {
      index: 0,
      size: 0,
    };
    $("#loader").show();
    let coursesData = this.courseService.getAllCourses(paginationModal);
    let campusData = this.campusService.getAllCampaus(paginationModal);
    let intakeData = this.intakeService.getAllIntake(paginationModal);
    let FeePayOptionData = this.feepayService.getAllFeePayBy(paginationModal);
    let socialPreferenceData =
      this.socialReferanceService.getAllSocialRef(paginationModal);
    let getVisaType = this.visaService.GetVisaType(paginationModal);
    let nationality = this.accountservices.getCountries();
    forkJoin([
      coursesData,
      campusData,
      intakeData,
      FeePayOptionData,
      socialPreferenceData,
      getVisaType,
      nationality,
    ]).subscribe(
      (result) => {
        $("#loader").hide();
        if (result[0]) {
          if (result[0].status) {
            this.courses = result[0].data.records;
          } else {
            this.toastr.ErrorToastr(result[0].message);
          }
        }
        if (result[1]) {
          if (result[1].status) {
            this.campuses = result[1].data.records;
          } else {
            this.toastr.ErrorToastr(result[1].message);
          }
        }
        if (result[2]) {
          if (result[2].status) {
            this.intakes = result[2].data.records;
            this.intakes.forEach((element) => {
              var current = element.yearOfStudy;
              this.dateofStudies.forEach((element) => {
                if (element == current) {
                  current = "";
                }
              });
              if (current != "") {
                this.dateofStudies.push(current);
              }
            });
          } else {
            this.toastr.ErrorToastr(result[2].message);
          }
        }
        if (result[3]) {
          if (result[3].status) {
            this.feePayOptions = result[3].data.records;
          } else {
            this.toastr.ErrorToastr(result[3].message);
          }
        }
        if (result[4]) {
          if (result[4].status) {
            this.SocialPreferences = result[4].data.records;
          } else {
            this.toastr.ErrorToastr(result[4].message);
          }
        }
        if (result[5]) {
          if (result[5].status) {
            this.visaTypes = result[5].data.records;
          } else {
            this.toastr.ErrorToastr(result[5].message);
          }
        }
        if (result[6]) {
          if (result[6].status) {
            this.nationalitydata = result[6].data;
            this.coutryofresidentdata = result[6].data;
          } else {
            this.toastr.ErrorToastr(result[6].message);
          }
        }
      },
      (err: any) => {
        $("#loader").hide();
        if (err.status == 401) {
          this.route.navigate(["/"]);
        } else {
          this.toastr.ErrorToastr("Something went wrong");
        }
      }
    );
    let selectedYear = new Date().getFullYear();
    for (let year = selectedYear; year >= 2015; year--) {
      this.completionYears.push(year);
    }
    // this.dateofStudies = [2022, 2023];
  }

  universitylist: any;
  GetUniversity() {
    this.Univercity.getUniversityList().subscribe((res) => {
      if (res.status) {
        this.universitylist = res.data;
      } else {
        this.toastr.ErrorToastr("Something went wrong");
      }
      $("#loader").hide();
    });
  }

  SaveSponcer() {
    this.isSubmitted = true;
    if (this.SponcerForm.valid) {
      $("#loader").show();
      var formVal = JSON.parse(JSON.stringify(this.SponcerForm.getRawValue()));
      formVal.SponcerType = this.f["feePayby"].value;
      formVal.sponsorId = parseInt(formVal.sponsorId);
      formVal.SponcerName = formVal.AuthorizedPersonName;
      console.log("FormValues",formVal);
      this.sponcerServices.AddSponcer(formVal).subscribe(
        (res) => {
          console.log("Save Sponsor API", res);
          if (res.status) {
            this.SponcerModel.close();
            this.toastr.SuccessToastr("Sponsor Added Successfullly.");
            this.ChangeFeepay();
            $("#sponsorIds").val(res.data.sponsorId);
            this.Applicationform.get("sponsorId")?.setValue(res.data.sponsorId);
            $("#loader").hide();
          } else {
            this.toastr.ErrorToastr("Duplicate Email cannot be added.");
            $("#loader").hide();
          }
        },
        (err: any) => {
          $("#loader").hide();
          this.toastr.ErrorToastr("Something missing");
        }
      );
    }
  }
  resetsponcerform() {
    this.SponcerForm.get("sponsorId")?.setValue(0);
    this.SponcerForm.get("AuthorizedPersonName")?.setValue("");
    this.SponcerForm.get("SponcerName")?.setValue("");
    this.SponcerForm.get("ContactDetail")?.setValue("");
    this.SponcerForm.get("EmailId")?.setValue("");
    this.SponcerForm.get("Address")?.setValue("");
    this.SponcerForm.get("PostalCode")?.setValue("");
    this.SponcerForm.get("CountryId")?.setValue("");
    this.SponcerForm.get("CityId")?.setValue("");
  }

  removeValidation() {
    // this.Applicationform.get("schoolCompletionYear")?.clearValidators();
    // this.Applicationform.get("secondarySchoolName")?.clearValidators();
    this.Applicationform.get("visaTypeDetail")?.clearValidators();
    this.Applicationform.get("visaType")?.clearValidators();
    this.Applicationform.get("hasVisa")?.clearValidators();
    this.Applicationform.get("hasExistMedicalCondition")?.clearValidators();
    this.Applicationform.get("medicalConditionDetail")?.clearValidators();
    this.Applicationform.get("lastSchoolQualification")?.clearValidators();
    this.Applicationform.get("feePayby")?.clearValidators();
    // this.Applicationform.get("suggestedUniversity")?.clearValidators();
    this.Applicationform.get("feePaybyDetail")?.clearValidators();
    this.Applicationform.get("socialRefrenceType")?.clearValidators();
    this.Applicationform.get("socialRefrenceTypeDetails")?.clearValidators();
    this.Applicationform.get("studyLocation")?.clearValidators();
    this.Applicationform.get("courseName")?.clearValidators();
    this.Applicationform.get("intake")?.clearValidators();
    //this.Applicationform.get("dateOfStudy")?.clearValidators();
    this.Applicationform.get("parentEmail")?.clearValidators();
    this.Applicationform.get("parentPhoneNo")?.clearValidators();
    this.Applicationform.get("parentCountryCode")?.clearValidators();
    this.Applicationform.get("parentLastName")?.clearValidators();
    this.Applicationform.get("parentFirstName")?.clearValidators();
    this.Applicationform.get("applicationId")?.clearValidators();
    this.Applicationform.get("firstName")?.clearValidators();
    this.Applicationform.get("lastName")?.clearValidators();
    this.Applicationform.get("email")?.clearValidators();
    this.Applicationform.get("dateOfBirth")?.clearValidators();
    this.Applicationform.get("nationality")?.clearValidators();
    this.Applicationform.get("countryOfResident")?.clearValidators();
    // this.Applicationform.get("adress")?.clearValidators();
    this.Applicationform.get("phoneNo")?.clearValidators();
    this.Applicationform.get("countryCode")?.clearValidators(); 
    this.Applicationform.get("applicationStatus")?.clearValidators();
    this.Applicationform.get("applicationSource")?.clearValidators();
    this.Applicationform.updateValueAndValidity();
  }
  setp1Validation() {
    // this.Applicationform.get("parentEmail")?.addValidators([
    //   Validators.required,
    //   Validators.pattern("[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}"),
    // ]);
    // this.Applicationform.get("parentPhoneNo")?.addValidators([
    //   Validators.required,
    //   Validators.pattern("[+,0-9]{10,12}"),
    // ]);
    // this.Applicationform.get("parentCountryCode")?.addValidators([
    //   Validators.required,
    // ]);
    // this.Applicationform.get("parentLastName")?.addValidators([
    //   Validators.required,
    //   this.noWhitespaceValidator,
    // ]);
    // this.Applicationform.get("parentFirstName")?.addValidators([
    //   Validators.required,
    //   this.noWhitespaceValidator,
    // ]);
    this.Applicationform.get("lastName")?.addValidators([
      Validators.required,
      this.noWhitespaceValidator,
    ]);
    this.Applicationform.get("firstName")?.addValidators([
      Validators.required,
      this.noWhitespaceValidator,
    ]);
    this.Applicationform.get("email")?.addValidators([
      Validators.required,
      Validators.pattern("[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}"),
    ]);
    // this.Applicationform.get("dateOfBirth")?.addValidators([
    //   Validators.required,
    //   this.noWhitespaceValidator,
    // ]);
    // this.Applicationform.get("nationality")?.addValidators([
    //   Validators.required,
    // ]);
    // this.Applicationform.get("countryOfResident")?.addValidators([
    //   Validators.required,
    // ]);
    // this.Applicationform.get("adress")?.addValidators([
    //   Validators.required,
    //   this.noWhitespaceValidator,
    // ]);
    this.Applicationform.get("phoneNo")?.clearValidators();
    this.Applicationform.get("phoneNo")?.addValidators([
      Validators.required,
      Validators.pattern("^[^0][0-9]{9,11}$"),
    ]);
    this.Applicationform.get("countryCode")?.addValidators([
      Validators.required,
    ]);
    this.Applicationform.get("phoneNo")?.updateValueAndValidity();
  this.Applicationform.get("countryCode")?.updateValueAndValidity();
  }
  // onCountryCodeChange(event: Event) {
  //   console.log("onCountryCodeChange");
  //   const selectedDialCode = (event.target as HTMLSelectElement).value;
  //   this.selectedCountryCode = selectedDialCode;
  //   console.log(this.selectedCountryCode);
  //   console.log(selectedDialCode);
  //   this.Applicationform.get('countryCode')?.setValue(selectedDialCode);
  //   console.log(this.Applicationform.get('countryCode')?.setValue(selectedDialCode));
  // }
  onCountryCodeChange(event: Event) {
    const selectedDialCode = (event.target as HTMLSelectElement).value;
    this.selectedCountryCode = selectedDialCode;

    // Get the countryCode control
    const countryCodeControl = this.Applicationform.get('countryCode');
    if (countryCodeControl) {
      countryCodeControl.setValue(selectedDialCode);
      console.log('Country code set to:', countryCodeControl.value); // Check the updated value
      this.cd.detectChanges();
    } else {
      console.error('Country Code control is not defined!');
    }
  }
  onParentCountryCodeChange(event: Event) {
    const selectedDialCode = (event.target as HTMLSelectElement).value;
    this.selectedParentCountryCode = selectedDialCode;

    // Get the parentCountryCode control
    const parentCountryCodeControl = this.Applicationform.get('parentCountryCode');
    if (parentCountryCodeControl) {
        parentCountryCodeControl.setValue(selectedDialCode);
        console.log('Parent country code set to:', parentCountryCodeControl.value); // Check updated value
    } else {
        console.error('Parent Country Code control is not defined!');
    }
}

  step2Validation() {
    this.Applicationform.get("parentEmail")?.addValidators([
      Validators.required,
      Validators.pattern("[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}"),
    ]);
     this.Applicationform.get("parentPhoneNo")?.addValidators([
      Validators.required,
      Validators.pattern("[+,0-9]{10,12}"),
    ]);
    this.Applicationform.get("parentCountryCode")?.addValidators([
      Validators.required,
    ]);
    this.Applicationform.get("parentLastName")?.addValidators([
        Validators.required,
        this.noWhitespaceValidator,
      ]);
     this.Applicationform.get("parentFirstName")?.addValidators([
      Validators.required,
      this.noWhitespaceValidator,
    ]);
    this.Applicationform.get("countryOfResident")?.addValidators([
      Validators.required,
    ]);
     this.Applicationform.get("nationality")?.addValidators([
      Validators.required,
    ]);
    this.Applicationform.get("dateOfBirth")?.addValidators([
      Validators.required,
      this.noWhitespaceValidator,
    ]);
    this.Applicationform.get("studyLocation")?.addValidators([
      Validators.required,
    ]);
    this.Applicationform.get("courseName")?.addValidators([
      Validators.required,
    ]);
    this.Applicationform.get("intake")?.addValidators([Validators.required]);
    // this.Applicationform.get("dateOfStudy")?.addValidators([
    //   Validators.required,
    // ]);
    // this.Applicationform.get("suggestedUniversity")?.addValidators([
    //   Validators.required,
    // ]);
    // this.Applicationform.get("schoolCompletionYear")?.addValidators([
    //   Validators.required,
    // ]);
    // this.Applicationform.get("secondarySchoolName")?.addValidators([
    //   Validators.required,
    //   this.noWhitespaceValidator,
    // ]);
    this.Applicationform.get("lastSchoolQualification")?.addValidators([
      Validators.required,
      this.noWhitespaceValidator,
    ]);
    this.Applicationform.get("feePayby")?.addValidators([Validators.required]);
  }
  step3Validation() {
    this.Applicationform.get("visaType")?.addValidators([Validators.required]);
    this.Applicationform.get("hasVisa")?.addValidators([Validators.required]);
    this.Applicationform.get("hasExistMedicalCondition")?.addValidators([
      Validators.required,
    ]);
    this.Applicationform.get("acceptTerms")?.addValidators([Validators.requiredTrue]);
  }

  inquiryId: any = 0;
  
//   saveApplication() {
   
//     console.log("click on next button");
//     this.isSubmitted = true;
//     console.log("value", this.Applicationform.value);

//     $("#loader").show();
//     let input = {
//         ...JSON.parse(JSON.stringify(this.Applicationform.getRawValue())),
//     };

//     input.nationality = input.nationality ? input.nationality.toString() : "";
//     input.countryOfResident = input.countryOfResident ? input.countryOfResident.toString() : "";
//     input.intake = Number.isNaN(parseInt(input.intake)) ? null : parseInt(input.intake);
//     input.courseName = input.courseName ? input.courseName.toString() : "";
//     input.studyLocation = input.studyLocation ? input.studyLocation.toString() : "";
//     input.visaType = input.visaType ? input.visaType.toString() : "";
//     input.feePayby = input.feePayby ? input.feePayby.toString() : "";
//     input.sponsorId = input.sponsorId === "0" ? null : parseInt(input.sponsorId);
//     input.socialRefrenceType = input.socialRefrenceType ? input.socialRefrenceType.toString() : "";
//     input.socialRefrenceTypeDetails = input.socialRefrenceTypeDetails ? input.socialRefrenceTypeDetails.toString() : "";
//     input.suggestedUniversity = input.suggestedUniversity ? input.suggestedUniversity.toString() : "";
//     input.hasVisa = input.hasVisa === "" ? null : input.hasVisa === true ? "true" : "false";
//     input.hasExistMedicalCondition =
//         input.hasExistMedicalCondition === true || input.hasExistMedicalCondition === false
//             ? input.hasExistMedicalCondition.toString()
//             : input.hasExistMedicalCondition === ""
//             ? null
//             : input.hasExistMedicalCondition;

//     console.log("api request", input);
//     this.applicationService.saveApplication(input).subscribe(
//         (res) => {
//             console.log("api response", res);
//             $("#loader").hide();
//             this.emittService.OnChangeapplication(this.requestFrom);
//             console.log("status", res.status);

//             if (res.status === true || res.status === false) {
//                 console.log("api response 2", res.status);

//                 if (res.data) {
//                     console.log("api response data", res.data);

//                     if (res.data.inquiryId > 0) {
//                         this.inquiryId = res.data.inquiryId;
//                     }
//                     sessionStorage.setItem('applicationId', res.data.applicationId || "0");
//                 } else {
//                     console.warn("res.data is null, proceeding with default values.");
//                     this.inquiryId = 0;
//                     sessionStorage.setItem('applicationId', "0");
//                 }

//                 $(".table").DataTable().ajax.reload();
//                 this.isSubmitted = false;

//                 if (this.currentStep == 2) {
//                     $("#loader").hide();
//                     this.isSecondStepCompleted = true;
//                 } else if (this.currentStep == 1) {
//                     $("#loader").hide();
//                     this.isFirstStepCompleted = true;
//                 }

//                 if (this.currentStep == 3) {
//                     $("#loader").hide();
//                     this.modalService.dismissAll();
//                     this.Applicationform.reset();

//                     let input = {
//                         appid: res.data?.applicationId || null,
//                         isFileUpload: res.data?.isUploadDocument || false,
//                     };

//                     if (res.data?.isUploadDocument) {
//                         this.Applicationform.get("applicationStatus").setValue("3");
//                     }

//                     this.emittService.onchangeApplicationStatusChange(input);

//                     this.applicationID = 0;
//                     this.applicationStage = 0;
//                     this.QualificationDocs = [];
//                     this.PassPortDocs = [];
//                     this.IELTSDocs = [];
//                 } else {
//                     this.Applicationform.markAsUntouched();
//                     if (this.currentStep != 3) this.currentStep++;
//                     this.removeValidation();

//                     if (this.currentStep == 2) {
//                         this.Applicationform.get("applicationStage").setValue("2");
//                         this.Applicationform.get("applicationStatus").setValue("-1");
//                         this.step2Validation();
//                     }

//                     if (this.currentStep == 3) {
//                         this.Applicationform.get("applicationStage").setValue("4");
//                         this.Applicationform.get("applicationStatus").setValue("3");
//                         this.step3Validation();
//                     }
//                 }

//                 $(".table").DataTable().ajax.reload();
//             } else {
//                 this.toastr.ErrorToastr(
//                     "Student application is not saved because " + res.message + "."
//                 );
//             }
//         },
//         (err: any) => {
//             $("#loader").hide();
//             this.toastr.ErrorToastr("Something went wrong");
//         }
//     );
// }
saveApplication() {
    debugger
    console.log("click on next button");
    this.isSubmitted = true;
    console.log("value",this.Applicationform.value);
   // if (this.Applicationform.valid) {
      $("#loader").show();
      let input = {
        ...JSON.parse(JSON.stringify(this.Applicationform.getRawValue())),
        // ielts: this.IELTSDocs,
        // qualifications: this.QualificationDocs,
        // passports: this.PassPortDocs,
      };
      input.nationality = input.nationality ? input.nationality.toString() :"" ;
      input.countryOfResident = input.countryOfResident ? input.countryOfResident.toString() : "" ;
      input.intake = Number.isNaN(parseInt(input.intake)) ? null : parseInt(input.intake);
      input.courseName = input.courseName ? input.courseName.toString() : "";
      input.studyLocation = input.studyLocation ? input.studyLocation.toString() : "";
      input.visaType = input.visaType ? input.visaType.toString() :"" ; 
      input.feePayby = input.feePayby ? input.feePayby.toString() : "";
      input.sponsorId = input.sponsorId === "0" ? null : parseInt(input.sponsorId);
      input.feePayby = input.feePayby ? input.feePayby.toString() : "";
      input.socialRefrenceType = input.socialRefrenceType ? input.socialRefrenceType.toString() : "";
      input.socialRefrenceTypeDetails = input.socialRefrenceTypeDetails ? input.socialRefrenceTypeDetails.toString() : "";
      input.suggestedUniversity = input.suggestedUniversity ? input.suggestedUniversity.toString() : "";
      if (input.hasVisa === "") {
        input.hasVisa = null;  // If empty, set as null
      } else {
        input.hasVisa = input.hasVisa === true ? "true" : "false";  // Ensure it's a boolean
      }
          // Convert hasExistMedicalCondition to string or null
          if (input.hasExistMedicalCondition === true || input.hasExistMedicalCondition === false) {
            input.hasExistMedicalCondition = input.hasExistMedicalCondition.toString();
          } else if (input.hasExistMedicalCondition === "") {
            input.hasExistMedicalCondition = null;
          } else if (input.hasExistMedicalCondition === null) {
            input.hasExistMedicalCondition = null;
          }
      console.log("api request",input);
      this.applicationService.saveApplication(input).subscribe(
        
        (res) => {
          console.log("api response",res);
          $("#loader").hide();
          this.emittService.OnChangeapplication(this.requestFrom);
          console.log("status",res.status);
          if (res.status === true || res.status === false ) {
            console.log("api response 2",res.status);
            if (res.data.inquiryId > 0) {
              this.inquiryId = res.data.inquiryId;
            }
            console.log("api response data ",res.data);
            sessionStorage.setItem('applicationId', res.data.applicationId);
            $(".table").DataTable().ajax.reload();
            this.isSubmitted = false;
            if (this.currentStep == 2) {
              $("#loader").hide();
              this.isSecondStepCompleted = true;
            } else if (this.currentStep == 1) {
              $("#loader").hide();
              this.isFirstStepCompleted = true;
            }
            if (this.currentStep == 3) {
              $("#loader").hide();
              this.modalService.dismissAll();
              this.Applicationform.reset();
              let input = {
                appid: res.data.applicationId,
                isFileUpload: res.data.isUploadDocument,
              };
              if (res.data.isUploadDocument == true) {
                this.Applicationform.get("applicationStatus").setValue("3");
              }
              this.emittService.onchangeApplicationStatusChange(input);
              this.applicationID = 0;
              // this.applicationStatus = 0;
              this.applicationStage = 0;
              this.QualificationDocs = [];
              this.PassPortDocs = [];
              this.IELTSDocs = [];
            } else {
              this.Applicationform.markAsUntouched();
              if (this.currentStep != 3) this.currentStep++;
              this.removeValidation();
              if (this.currentStep == 2) {
                this.Applicationform.get("applicationStage").setValue("2");
                this.Applicationform.get("applicationStatus").setValue("-1");
                this.step2Validation();
              }
              if (this.currentStep == 3) {
                this.Applicationform.get("applicationStage").setValue("4");
                this.Applicationform.get("applicationStatus").setValue("3");
                this.step3Validation();
              }
              
            }
            $(".table").DataTable().ajax.reload();
          } else {
            this.toastr.ErrorToastr(
              "Student application is not saved bacause " + res.message + "."
            );
          }
          setTimeout(() => {
            const inputElement = document.getElementById('phoneInputId') as HTMLInputElement;
            if (inputElement) {
              const iti = intlTelInput(inputElement, {
                initialCountry: "us",
                separateDialCode: true,
                utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
              });
              inputElement.addEventListener("countrychange", () => {
                const selectedCountryData = iti.getSelectedCountryData();
                const countryCode = selectedCountryData.dialCode; // Retrieve the dial code
                console.log("Selected country code:", countryCode);
        
                // Optionally, set the country code in your form
                this.Applicationform.get("countryCode").setValue(countryCode);
              });
            } else {
              console.error("Input element not found.");
            }
              // Initialize for parentPhoneNo
          },10)
        },
        
        (err: any) => {
          $("#loader").hide();
          this.toastr.ErrorToastr("Something went wrong");
        }
      );
      
    //}
  }

  
  IsvisaTypeDetail: any = false;
  changevisa() {
   
    let input = JSON.parse(JSON.stringify(this.Applicationform.getRawValue()));
    if (input.visaType == 9) {
      this.IsvisaTypeDetail = true;
      this.Applicationform.get("visaTypeDetail")?.addValidators(
        Validators.required
      );
      // this.Applicationform.get("visaTypeDetail")?.clearValidators();
    } else {
      this.IsvisaTypeDetail = false;
      // this.Applicationform.get("visaTypeDetail")?.removeValidators(
      //   Validators.required
      // );
      this.Applicationform.get("visaTypeDetail")?.clearValidators();
      this.Applicationform.get("visaTypeDetail")?.updateValueAndValidity();
      // Ensure change detection is triggered
      this.cd.detectChanges();
      console.log("Is visaTypeDetail required:", this.Applicationform.get("visaTypeDetail")?.hasValidator(Validators.required));
      console.log("Form Validity:", this.Applicationform.valid);
      console.log("isVisa", this.IsvisaTypeDetail); 
    }
  }
  // saveAsDraft() {
  //   $("#loader").show();
  //   let input = JSON.parse(JSON.stringify(this.Applicationform.getRawValue()));
  //   input.intake = parseInt(input.intake);
  //   input.nationality = input.nationality ? input.nationality.toString() :"" ;
  //   input.courseName = input.courseName ? input.courseName.toString() : "";
  //   input.visaType = input.visaType ? input.visaType.toString() :"" ; 
  //   input.feePayby = input.feePayby ? input.feePayby.toString() : "";
  //   input.countryOfResident = input.countryOfResident ? input.countryOfResident.toString() : "" ;
  //   input.studyLocation = input.studyLocation ? input.studyLocation.toString() : "";
  //   input.socialRefrenceType = input.socialRefrenceType ? input.socialRefrenceType.toString() : "";
  //   if (input.hasVisa === "" ) {
  //     input.hasVisa = null;  // If empty, set as null
  //   } else {
  //     input.hasVisa = input.hasVisa === true ? "true" : "false";  // Ensure it's a boolean
  //   }
  //   if (input.hasExistMedicalCondition === true || input.hasExistMedicalCondition === false) {
  //     input.hasExistMedicalCondition = input.hasExistMedicalCondition.toString();
  //   } else if (input.hasExistMedicalCondition === "") {
  //     input.hasExistMedicalCondition = null;
  //   } else if (input.hasExistMedicalCondition === null) {
  //     input.hasExistMedicalCondition = null;
  //   }
  //   input.hasExistMedicalCondition = null;
  //   input.hasVisa = null;
  //   input.hasExistMedicalCondition = input.hasExistMedicalCondition == "true" ? true : false;
  //   input.hasVisa = input.hasVisa == "true" ? true : false;
  //   if (this.applicationID > 0) {
  //     input.applicationStage =
  //       this.applicationStage < input.applicationStage
  //         ? input.applicationStage
  //         : this.applicationStage;
  //     input.applicationStatus = this.applicationStatus;
  //   }
  //   if (this.currentStep == 2) input.applicationStage = 1;
  //   else if (this.currentStep == 3) {
  //     if (input.hasExistMedicalCondition == "") {
  //       input.hasExistMedicalCondition = null;
  //     } else {
  //       input.hasExistMedicalCondition =
  //         input.hasExistMedicalCondition == "true" ? true : false;
  //     }
  //     if (input.hasVisa === "") {
  //       input.hasVisa = null;  // If empty, set as null
  //     } else {
  //       input.hasVisa = input.hasVisa === true ? "true" : "false";  // Ensure it's a boolean
  //     }
  //     input.applicationStage = 2;
  //   }
  //   this.applicationService.saveApplication(input).subscribe(
  //     (res) => {
  //       $("#loader").hide();
  //       this.emittService.OnChangeapplication(this.requestFrom);
  //       if (this.currentStep == 1) {
  //         this.isFirstStepCompleted = true;
  //       }
  //       if (!res.status) {
  //         this.toastr.ErrorToastr("Student application is not saved as draft.");
  //       }
  //       $(".table").DataTable().ajax.reload();
  //     },
  //     (err: any) => {
  //       $("#loader").hide();
  //       if (err.status == 400)
  //         this.toastr.ErrorToastr("Please enter valid inputs.");
  //       else this.toastr.ErrorToastr("Something went wrong");
  //     }
  //   );
  // }
  saveAsDraft() {
  
    $("#loader").show();
    let input = JSON.parse(JSON.stringify(this.Applicationform.getRawValue()));
    input.intake = input.intake ? parseInt(input.intake) : null;
    input.nationality = input.nationality ? input.nationality.toString() : "";
    input.courseName = input.courseName ? input.courseName.toString() : "";
    input.visaType = input.visaType ? input.visaType.toString() : "";
    input.feePayby = input.feePayby ? input.feePayby.toString() : "";
    input.countryOfResident = input.countryOfResident ? input.countryOfResident.toString() : "";
    input.studyLocation = input.studyLocation ? input.studyLocation.toString() : "";
    input.socialRefrenceType = input.socialRefrenceType ? input.socialRefrenceType.toString() : "";
    if (input.hasVisa === "" || input.hasVisa === null) {
      input.hasVisa = null; 
    } else {
      input.hasVisa = input.hasVisa === true ? "true" : "false"; 
    }
    if (input.hasExistMedicalCondition === "" || input.hasExistMedicalCondition === null) {
      input.hasExistMedicalCondition = null; 
    } else {
      input.hasExistMedicalCondition =
        input.hasExistMedicalCondition === true ? "true" : "false"; 
    }
    if (this.applicationID > 0) {
      input.applicationStage =
        this.applicationStage < input.applicationStage
          ? input.applicationStage
          : this.applicationStage;
      input.applicationStatus = this.applicationStatus;
    }
    if (this.currentStep == 2) {
      input.applicationStage = 1;
    } else if (this.currentStep == 3) {
      input.applicationStage = 2;
    }
    console.log("API REQUEST",input);
    this.applicationService.saveApplication(input).subscribe(
      (res) => {
        console.log("res",res);
        $("#loader").hide();
        // this.emittService.OnChangeapplication(this.requestFrom);
        // if (this.currentStep == 1) {
        //   this.isFirstStepCompleted = true;
        // }
        if (res.status) {
          // this.toastr.ErrorToastr("Student application is not saved as draft.");
          this.emittService.OnChangeapplication(this.requestFrom);
          if (this.currentStep == 1) {
             this.isFirstStepCompleted = true;
           }
        }
        else{
          this.toastr.ErrorToastr("Student application is not saved as draft.");
        }
        $(".table").DataTable().ajax.reload();
      },
      (err: any) => {
        $("#loader").hide();
        if (err.status == 400)
          this.toastr.ErrorToastr("Please enter valid inputs.");
        else this.toastr.ErrorToastr("Something went wrong");
      }
    );
  }

  


  previousStep() {
    $("#loader").show();
    this.currentStep--;
    this.removeValidation();
    if (this.currentStep == 1) {
      this.Applicationform.get("applicationStatus").setValue("-1");
      this.Applicationform.get("applicationStage").setValue("1");
      this.setp1Validation();
      $("#loader").hide();
    }
    if (this.currentStep == 2) {
      this.Applicationform.get("applicationStatus").setValue("-1");
      this.Applicationform.get("applicationStage").setValue("2");
      this.step2Validation();
      $("#loader").hide();
    }
    if (this.currentStep == 3) {
      this.Applicationform.get("applicationStage").setValue("4");
      this.step3Validation();
      this.Applicationform.updateValueAndValidity();
      $("#loader").hide();
    }
    setTimeout(() => {
      const inputElement = document.getElementById('phoneInputId') as HTMLInputElement;
      if (inputElement) {
        const iti = intlTelInput(inputElement, {
          initialCountry: "us",
          separateDialCode: true,
          utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
        });
        inputElement.addEventListener("countrychange", () => {
          const selectedCountryData = iti.getSelectedCountryData();
          const countryCode = selectedCountryData.dialCode; // Retrieve the dial code
          console.log("Selected country code:", countryCode);
  
          // Optionally, set the country code in your form
          this.Applicationform.get("countryCode").setValue(countryCode);
        });
      } else {
        console.error("Input element not found.");
      }
        // Initialize for parentPhoneNo
    },10)
  }

  // changeQualification(event) {
  //   this.QualificationDocs = [];
  //   const files = event.target.files;
  //   for (var i = 0; i < files.length; i++) {
  //     const reader = new FileReader();
  //     let file = files[i];
  //     reader.readAsDataURL(file);
  //     reader.onload = () => {
  //       let fileinput = {
  //         imageName: file.name,
  //         image: reader.result.toString().split(",")[1],
  //       };
  //       this.QualificationDocs.push(fileinput);
  //     };
  //   }
  // }
  // changeIELTS(event) {
  //   this.IELTSDocs = [];
  //   const files = event.target.files;
  //   for (var i = 0; i < files.length; i++) {
  //     const reader = new FileReader();
  //     let file = files[i];
  //     reader.readAsDataURL(file);
  //     reader.onload = () => {
  //       let fileinput = {
  //         imageName: file.name,
  //         image: reader.result.toString().split(",")[1],
  //       };
  //       this.IELTSDocs.push(fileinput);
  //     };
  //   }
  // }
  // changePassport(event) {
  //   this.PassPortDocs = [];
  //   const files = event.target.files;
  //   for (var i = 0; i < files.length; i++) {
  //     const reader = new FileReader();
  //     let file = files[i];
  //     reader.readAsDataURL(file);
  //     reader.onload = () => {
  //       let fileinput = {
  //         imageName: file.name,
  //         image: reader.result.toString().split(",")[1],
  //       };
  //       this.PassPortDocs.push(fileinput);
  //     };
  //   }
  // }
  Inquiries: any;
  matchedInquiry: any;
  inquiryModal: any;
  IsMatched = false;
  InquiryLinkUnLink() {
    if (this.Applicationform.valid) {
      if (this.inquiryId < 1) {
        this.alerts
          .ComfirmAlert(
            "Do you want to link the inquiry to this application? ",
            "Yes",
            "No"
          )
          .then((res) => {
            if (res.isConfirmed) {
              $("#loader").show();
              let input = {
                applicationId: this.applicationID,
                email: this.Applicationform.controls.email.value,
              };
              this.applicationService.FetchInquiries(input).subscribe((res) => {
                if (res.status) {
                  this.Inquiries = res.data;
                  this.Inquiries.forEach((element) => {
                    if (element.isMatched == true) {
                      this.matchedInquiry = element.inquiryId;
                      this.IsMatched = true;
                    }
                    element.firstName =
                      element.lastName + " " + element.firstName;
                  });
                  this.LinkInquiryForm.controls.inquiryId.addValidators(
                    Validators.required
                  );
                  this.LinkInquiryForm.controls.inquiryId.updateValueAndValidity();
                  this.inquiryModal = this.modalService.open(this.LinkInquiry, {
                    ariaLabelledBy: "modal-basic-title",
                  });
                } else {
                  this.toastr.ErrorToastr("Something went wrong");
                }
                $("#loader").hide();
              });
            } else {
              $("#loader").hide();
              this.saveApplication();
            }
          });
      } else {
        $("#loader").show();
        this.saveApplication();
        $("#loader").hide();
        this.modalObj.close();
      }
    }
  }

  LinkInquiryToApplication() {
    // if (this.IsMatched == false) {
    this.alerts
      .ComfirmAlert(
        "Are you sure you want to link the inquiry to this application? ",
        "Yes",
        "No"
      )
      .then((res) => {
        if (res.isConfirmed) {
          this.inquiryModal.close();
          this.Applicationform.controls.InquiryId.setValue(
            this.LinkInquiryForm.controls.inquiryId.value
          );
          this.LinkInquiryForm.controls.inquiryId.removeValidators(
            Validators.required
          );
          this.LinkInquiryForm.controls.inquiryId.updateValueAndValidity();
          this.LinkInquiryForm.reset();
          this.saveApplication();
        } else {
          this.LinkInquiryForm.controls.inquiryId.removeValidators(
            Validators.required
          );
          this.LinkInquiryForm.controls.inquiryId.updateValueAndValidity();
          this.LinkInquiryForm.reset();
          this.saveApplication();
        }
      });
    // }
  }

  getCourseByCampus() {
    // alert("course")
    $("#loader").show();
    this.f["courseName"].setValue(null);
    this.f["intake"].setValue(null);
    let input = {
      campusId: this.f["studyLocation"].value,
    };
    this.courseService.getCoursesByCampus(input).subscribe(
      (res) => {
        if (res.status) {
          this.courses = res.data.records;
        } else {
          this.toastr.ErrorToastr(res.message);
        }
        $("#loader").hide();
      },
      (err: any) => {
        $("#loader").hide();
        // this.toastr.ErrorToastr("Something went wrong");
      }
    );
  }

  getIntakeByCampusCourse() {
    // alert("intake")
    $("#loader").show();
    this.f["intake"].setValue(null);
    let input = {
      campusId: this.f["studyLocation"].value,
      courseId: this.f["courseName"].value,
    };
    this.intakeService.getIntakesByCampusCourse(input).subscribe(
      (res) => {
        if (res.status) {
          this.intakes = res.data.records;
        } else {
          this.toastr.ErrorToastr(res.message);
        }
        $("#loader").hide();
      },
      (err: any) => {
        $("#loader").hide();
        // this.toastr.ErrorToastr("Something went wrong");
        console.log(err);
      }
    );
  }
  SponcerList: any = [];
  targetText: string = "Hello, world!";
  searchText: string = "";

  calculateLevenshteinDistance(source: string, target: string): number {
    if (!source.length) return target.length;
    if (!target.length) return source.length;

    const matrix = [];

    for (let i = 0; i <= target.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= source.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= target.length; i++) {
      for (let j = 1; j <= source.length; j++) {
        if (target.charAt(i - 1) === source.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1 // deletion
          );
        }
      }
    }

    return matrix[target.length][source.length];
  }
  IsSponcer: any = false;
  ChangeFeepay() {
    var AppDatas = JSON.parse(
      JSON.stringify(this.Applicationform.getRawValue())
    );
    let id = AppDatas.feePayby;
    const feePayor = this.feePayOptions.find(
      (m) => m.feePaybyId == id
    )?.feePaidPerson;
    const isTextMatch =
      feePayor?.toLocaleLowerCase().includes("sponsor") ||
      feePayor?.toLocaleLowerCase().includes("specify");
    if (isTextMatch) {
      $("#loader").show();
      this.Applicationform.get("sponsorId")?.addValidators([
        Validators.required,
      ]);
      this.IsSponcer = true;
      let input = {
        SponcerType: id,
      };
      this.intakeService.GetSponcerList(input).subscribe(
        (res) => {
          if (res.status) {
            this.SponcerList = res.data;
            this.SponcerList.push({ sponsorId: 0, sponcerName: "Other" });
          } else {
            this.toastr.ErrorToastr(res.message);
          }
          $("#loader").hide();
        },
        (err: any) => {
          $("#loader").hide();
          console.log(err);
        }
      );
    } else {

      this.IsSponcer = false;
      this.Applicationform.get("sponsorId")?.updateValueAndValidity();
      this.Applicationform.get("sponsorId")?.clearValidators(); 
    
    }
    this.Applicationform.get("sponsorId")?.updateValueAndValidity();
    this.Applicationform.get("sponsorId")?.markAsDirty();
  }
  SponcerModel: any;
  ChangeSponcer() {
    let id = $("#sponsorIds").val();
    if (id == 0) {
      this.SponcerModel = this.modalService.open(this.SponcerModal, {
        ariaLabelledBy: "modal-basic-title",
        size: "lg",
        backdrop: false,
      });
      $("#sponsorIds").val("");
    }
    this.Applicationform.get("sponsorId")?.updateValueAndValidity();
    this.Applicationform.get("sponsorId")?.markAsDirty();
   
  }
}
