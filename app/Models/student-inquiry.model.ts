import { Country } from "./country.model";

export class StudentInquiry {
    index: number = 0;
    inquiryId: number = 0;
    email: string = '';
    fullName: string = '';
    message: string = '';
    references: string = '';
    countryData: Country;
    campusData: InquiryCampus;
    assignToData: InquiryAssignTo;
    intakeData: any;
    sourceData: InquirySourse;
    enquiryStatusData: InquiryStatus;
    createdBy: InquiryProfile;
    createdDate: string = '';
    updatedBy: InquiryProfile;
    updatedDate: string = '';
}

export class InquirySourse {
    sourceId: number = 0;
    sourceName: string = '';
}

export class InquiryProfile {
    userId: number = 0;
    userName: string = '';
    image: string = '';
    userType: number = 0;
    userTypeName: string = '';
}
export class InquiryStatus {
    statusId: number = 0;
    statusName: string = '';
    statusClass: string = '';
}

export class InquiryCampus {
    campusId: number = 0;
    campusName: string = '';
}

export class InquiryAssignTo {
    assignToId: number = 0;
    assignToName: string = '';
}