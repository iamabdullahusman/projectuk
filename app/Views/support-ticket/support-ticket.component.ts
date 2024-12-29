import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { SupportTicketService } from "src/app/Services/support-ticket.service";
import { ToastrServiceService } from "src/app/services/toastr-service.service";

@Component({
  selector: "app-support-ticket",
  templateUrl: "./support-ticket.component.html",
  styleUrls: ["./support-ticket.component.sass"],
})
export class SupportTicketComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  supportTickets = [];
  ticketId = 0;

  constructor(
    private supportTicketService: SupportTicketService,
    private toastr: ToastrServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }
  loadData() {
    let input = {
      pageSize: 10,
      startFrom: 1,
      applicationId: 0,
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
}
