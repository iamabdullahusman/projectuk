import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { SessionStorageService } from "src/app/services/session-storage.service";
import { SupportTicketService } from "src/app/Services/support-ticket.service";
import { ToastrServiceService } from "src/app/services/toastr-service.service";
import * as moment from "moment";
@Component({
  selector: "app-support-ticket-chat",
  templateUrl: "./support-ticket-chat.component.html",
  styleUrls: ["./support-ticket-chat.component.sass"],
})
export class SupportTicketChatComponent implements OnInit, OnChanges {
  @Input() ticketID: number = 0;
  @Output() back = new EventEmitter<void>();
  chats = [];
  userid: number;
  ticketStatus: any;
  supportStatus = [];
  isCloseOrCancel = false;
  SupportTicketsForm: FormGroup = new FormGroup({
    supportTicketId: new FormControl(),
    applicationId: new FormControl(),
    ticketStatus: new FormControl(),
    title: new FormControl(),
    details: new FormControl(),
    perentTicketId: new FormControl(),
    attachment: new FormControl(),
    attachmentName: new FormControl(),
  });
  constructor(
    private supportTicketService: SupportTicketService,
    private toastr: ToastrServiceService,
    private router: Router,
    private sessionStorage: SessionStorageService,
    private formBuilder: FormBuilder
  ) {
    this.SupportTicketsForm = formBuilder.group({
      supportTicketId: [0, [Validators.required]],
      applicationId: [null, [Validators.required]],
      ticketStatus: [null, [Validators.required]],
      title: [null, [Validators.required]],
      details: [null, [Validators.required]],
      perentTicketId: [null, [Validators.required]],
      attachment: [""],
      attachmentName: [""],
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes["ticketID"]) {
      if (this.ticketID > 0) this.loadData();
    }
  }

  ngOnInit(): void {
    this.userid = parseInt(this.sessionStorage.getuserID());
    this.loadSupportStatus();
  }
  loadData() {
    $("#loader").show();
    var input = {
      supportId: this.ticketID,
    };
    this.supportTicketService.GetSupportTicketById(input).subscribe(
      (res) => {
        if (res.status) {
          this.chats = res.data;
          this.resetForm();
          // var ticket = this.chats.find(m => m.perentTicketId == 0);
          var ticket = this.chats.find(
            (m) => m.supportTicketId == this.ticketID
          );
          this.ticketStatus = this.supportStatus.find(
            (m) => m.id == ticket.ticketStatus
          ).name;
          this.isCloseOrCancel =
            ticket.ticketStatus == 3 ||
            ticket.ticketStatus == 4 ||
            ticket.ticketStatus == 2;
          setTimeout(function () {
            var ele = document.getElementsByClassName("modal-tab-scroll")[0];
            ele.scrollTop = ele.scrollHeight;
          }, 10);
        } else {
          this.toastr.ErrorToastr(res.message);
        }
        $("#loader").hide();
      },
      (err: any) => {
        $("#loader").hide();
        if (err.status == 401) {
          this.router.navigate(["/"]);
        } else {
          this.toastr.ErrorToastr("Something went wrong");
        }
      }
    );
  }

  loadSupportStatus() {
    this.supportStatus.push({
      id: 1,
      name: "Open",
      isDisplay: true,
    });
    this.supportStatus.push({
      id: 2,
      name: "Solved",
      isDisplay: false,
    });
    this.supportStatus.push({
      id: 3,
      name: "Cancelled",
      isDisplay: true,
    });
    this.supportStatus.push({
      id: 4,
      name: "Closed",
      isDisplay: false,
    });
  }
  getDateFormat(date, format) {
    let today = moment().format(format);
    let yesterday = moment(-1, "days").format(format);
    let tommorrow = moment(1, "days").format(format);
    let nowDate = moment(date).format(format);
    if (today == nowDate) return "Today";
    else if (yesterday == nowDate) return "Yesterday";
    else if (tommorrow == nowDate) return "Tommorrow";
    else return nowDate;
  }

  addChat() {
    if (this.SupportTicketsForm.valid) {
      this.supportTicketService
        .AddSupportTicket(this.SupportTicketsForm.getRawValue())
        .subscribe(
          (res) => {
            if (res.status) {
              this.loadData();
            } else {
              this.toastr.ErrorToastr(res.message);
            }
            $("#loader").hide();
          },
          (err: any) => {
            this.toastr.ErrorToastr("Something went wrong");
            console.log(err);
            $("#loader").hide();
          }
        );
    }
  }
  resetForm() {
    this.SupportTicketsForm.reset();
    this.SupportTicketsForm.get("ticketStatus").setValue(0);
    this.SupportTicketsForm.get("perentTicketId").setValue(this.ticketID);
    this.SupportTicketsForm.get("supportTicketId").setValue(0);
    this.SupportTicketsForm.get("title").setValue(this.chats[0].title);
    this.SupportTicketsForm.get("applicationId").setValue(
      this.chats.find((m) => m.supportTicketId == this.ticketID).applicationId
    );
  }
  backToTicket() {
    this.back.next();
  }
  changeStatus(statusId) {
    var input = {
      ticketId: this.ticketID,
      status: statusId,
    };
    this.supportTicketService.UpdateSupportTicketStatus(input).subscribe(
      (res) => {
        if (res.status) {
          this.toastr.SuccessToastr(res.data);
          this.loadData();
        } else {
          this.toastr.ErrorToastr(res.message);
        }
      },
      (err: any) => {
        this.toastr.ErrorToastr("Something went wrong");
      }
    );
  }
}
