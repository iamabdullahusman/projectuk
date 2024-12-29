import { Component, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmittService } from 'src/app/Services/emitt.service';
import { AppConfig } from 'src/app/appconfig';

@Component({
  selector: 'app-offer-details',
  templateUrl: './offer-details.component.html',
  styleUrls: ['./offer-details.component.sass']
})
export class OfferDetailsComponent {
  @ViewChild("applicationDetailModal") applicationDetailsModal: ElementRef
  OfferData: any;
  EmailDocument: any;
  urlSafe: SafeResourceUrl;
  offerUrl: any;
  constructor(private emittService: EmittService, private modalService: NgbModal, public sanitizer: DomSanitizer, private appConfig: AppConfig
  ) {
    this.emittService.getOfferIdChange().subscribe(res => {
      this.EmailDocument = res.Emaildocument;
      this.OfferData = res.Detail;
      this.OpenOfferDetailModel()
    })

  }

  ngOnInit(): void {
  }

  OpenOfferDetailModel() {
    this.offerUrl = this.appConfig.baseServiceUrl + this.OfferData.offerLetterUrl;
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.offerUrl);
    this.modalService.open(this.applicationDetailsModal, { size: 'lg', ariaLabelledBy: 'modal-basic-title', windowClass: 'application-window', backdrop: false, modalDialogClass: 'application-dialog my-0 h-100 me-0' });
  }
}
