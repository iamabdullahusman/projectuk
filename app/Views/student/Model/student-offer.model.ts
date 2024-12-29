
export class StudentOffer {
    applicationId: number = 0;
    ifOffered: boolean = false;
    offerDetail: OfferDetail;
    requestedDocuments: RequestedDocuments[];
    emailedDocuments: EmailedDocuments[];
    applicationOfferDetail: ApplicationOfferDetail;
}

export class OfferDetail {
    offerId: number = 0;
    offerType: number = 0;
    offerName: string = '';
    offerDescription: string = '';
}

export class RequestedDocuments {
    documentTypeId: number = 0;
    documentName: string = '';
    documentDescription: string = '';
    documentTag: number = 0;
    documentTagName: string = '';
    sampleDocumentUrl: string = '';
    documentSampleUrl: string = '';
    documentType: number = 0;
    documentTypeName: string = '';
}

export class ApplicationOfferDetail {
    applicationOfferId: number = 0;
    applicationId: number = 0;
    offerType: number = 0;
    comment: string = '';
    offerId: number = 0;
    hasConfirmOffer: boolean = false;
    applicationOfferName: string = '';
}

export class EmailedDocuments {
    aODVEId: number = 0;
    applicationId: number = 0;
    offerId: number = 0;
    applicationOfferId: number = 0;
    docId: number = 0;
    fileName: string = '';
    filePath: string = '';
    docTypeName: string = '';
}
