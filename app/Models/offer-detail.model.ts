export class OfferDetail {
  offerType: number;
  offerTypeName: String;
  documentRequestedCount: number;
  amount: number;
  offerDate: any;
  offerStatus: number;
  offerStatusName: string;
  documents: Array<DocumentTypeMaster>;
  reason: String;
}
export class DocumentTypeMaster {
  documenTypeId: number;
  documentName: String;
  documentDescription: String;
  isChecked: boolean;
  isActive: boolean;
  documentTag: number;
  documentType: number;
  sampleDocumentUrl: string;
  documentTagName: string;
  documentSampleUrl: string;
  documentTypeName: string;
}
