import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";

@Component({
  selector: "app-offer-document",
  templateUrl: "./offer-document.component.html",
  styleUrls: ["./offer-document.component.sass"],
})
export class OfferDocumentComponent implements OnChanges {
  @Input() documents = [];
  ngOnChanges(changes: SimpleChanges): void {
    if (changes["documents"]) {
      if (this.documents.length > 2)
        this.documents = this.documents.splice(0, 2);
    }
  }
}
