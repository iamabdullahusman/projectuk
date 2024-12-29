import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SupportTicketService } from "src/app/Services/support-ticket.service";
import { SessionStorageService } from "src/app/services/session-storage.service";
import { ToastrServiceService } from "src/app/services/toastr-service.service";

@Component({
  selector: "app-support-ticket",
  templateUrl: "./support-ticket.component.html",
  styleUrls: ["./support-ticket.component.sass"],
})
export class SupportTicketComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  ticketId = 0;
  supportTickets = [];
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

  @ViewChild("SupportTicketModel") SupportTicketModel: ElementRef;
  constructor(
    private supportTicketService: SupportTicketService,
    private sessionService: SessionStorageService,
    private toastr: ToastrServiceService,
    private router: Router,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {
    this.SupportTicketsForm = this.formBuilder.group({
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

  ngOnInit(): void {
    this.loadData();
  }
  loadData() {
    let input = {
      pageSize: 10,
      startFrom: 1,
      applicationId: this.sessionService.getUserApplicationId(),
      searchText: "",
      orderByDirection: "",
      sortingColumn: 0,
      orderBy: "",
    };

    this.dtOptions = {
      pagingType: "simple_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      searching: true,
      language: {
        infoFiltered: "",
      },
      ajax: (dataTablesParameters: any, callback) => {
        this.supportTickets = [];
        input.pageSize = dataTablesParameters.length;
        input.startFrom = dataTablesParameters.start;
        input.searchText = dataTablesParameters.search.value;
        input.orderByDirection = dataTablesParameters.order[0].dir;
        input.sortingColumn = dataTablesParameters.order[0].column;
        input.orderBy = dataTablesParameters.columns[input.sortingColumn].data;

        this.supportTicketService.GetSupportTickets(input).subscribe(
          (res) => {
            if (res.status) {
              this.supportTickets = res.data.records;
            } else {
              this.toastr.ErrorToastr("Something went wrong");
            }

            callback({
              recordsTotal: res.data.totalCounts,
              recordsFiltered: res.data.totalCounts,
              data: [],
            });
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
      },
      columns: [
        { data: "stm.Title", orderable: true, searchable: true },
        { data: "stm.TicketStatus", orderable: true, searchable: true },
        { data: "um.Name", orderable: true, searchable: true },
        { data: "stm.CreatedDate", orderable: true, searchable: true },
        { data: "", orderable: false, searchable: false },
      ],
      autoWidth: false,
    };
  }

  get f() {
    return this.SupportTicketsForm.controls;
  }

  openModel() {
    this.SupportTicketsForm.reset();
    this.SupportTicketsForm.get("ticketStatus").setValue(0);
    this.SupportTicketsForm.get("perentTicketId").setValue(0);
    this.SupportTicketsForm.get("supportTicketId").setValue(0);
    this.SupportTicketsForm.get("applicationId").setValue(
      this.sessionService.getUserApplicationId()
    );
    this.modalService.open(this.SupportTicketModel, {
      ariaLabelledBy: "modal-basic-title",
    });
  }
  saveTicket() {
    if (this.SupportTicketsForm.valid) {
      let data = this.SupportTicketsForm.getRawValue();
      if (data.applicationId == 0) {
        this.toastr.ErrorToastr("Please select Application.");
      } else {
        $("#loader").show();
        this.supportTicketService
          .AddSupportTicket(this.SupportTicketsForm.getRawValue())
          .subscribe(
            (res) => {
              if (res.status) {
                this.toastr.SuccessToastr(res.data);
                $(".table").DataTable().ajax.reload();
                this.modalService.dismissAll();
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
  }
}
