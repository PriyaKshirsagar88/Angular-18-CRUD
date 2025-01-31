export class EmployeeModel {
    empId: number;
    name: string;
    city: string;
    state: string;
    emailId: string;
    contactNo: string;
    address: string;
    pinCode: number | undefined;


    constructor() {
        this.address = '';
        this.city = '';
        this.contactNo  = '';
        this.emailId  = '';
        this.empId  = 1;
        this.name  = '';
        this.state  = '';
        }
}

