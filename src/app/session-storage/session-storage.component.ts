import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeModel } from '../model/Employee';

@Component({
  selector: 'app-session-storage',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './session-storage.component.html',
  styleUrl: './session-storage.component.css'
})
export class SessionStorageComponent {
  employeeForm: FormGroup = new FormGroup({});
  employeeObj: EmployeeModel = new EmployeeModel();
  employeeList: EmployeeModel[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadSessionStorageData();
    } else {
      console.log('This code is running on the server, sessionStorage is not available.');
    }
    this.createForm();
  }

  private loadSessionStorageData() {
    const oldData = sessionStorage.getItem("EmpData");
    if (oldData) {
      this.employeeList = JSON.parse(oldData);
    }
  }

  createForm() {
    this.employeeForm = new FormGroup({
      empId: new FormControl(this.employeeObj.empId),
      name: new FormControl(this.employeeObj.name, [Validators.required]),
      city: new FormControl(this.employeeObj.city),
      address: new FormControl(this.employeeObj.address),
      contactNo: new FormControl(this.employeeObj.contactNo),
      emailId: new FormControl(this.employeeObj.emailId),
      pinCode: new FormControl(this.employeeObj.pinCode, [Validators.required, Validators.minLength(6)]),
      state: new FormControl(this.employeeObj.state),
    });
  }

  onSave() {
    if (isPlatformBrowser(this.platformId)) {
      const oldData = sessionStorage.getItem("EmpData");
      if (oldData) {
        const parseData = JSON.parse(oldData);
        this.employeeForm.controls['empId'].setValue(parseData.length + 1);
        this.employeeList.unshift(this.employeeForm.value);
      } else {
        this.employeeList.unshift(this.employeeForm.value);
      }
      sessionStorage.setItem("EmpData", JSON.stringify(this.employeeList));
      this.onReset();
    }
  }

  onEdit(item: EmployeeModel) {
    this.employeeObj = item;
    this.createForm();
  }

  onUpdate() {
    const record = this.employeeList.find(m => m.empId == this.employeeForm.controls['empId'].value);
    if (record != undefined) {
      record.address = this.employeeForm.controls['address'].value;
      record.name = this.employeeForm.controls['name'].value;
      record.contactNo = this.employeeForm.controls['contactNo'].value;
    }
    sessionStorage.setItem("EmpData", JSON.stringify(this.employeeList));
    this.employeeObj = new EmployeeModel();
    this.createForm();
  }

  onDelete(id: number) {
    const isDelete = confirm("Are you sure you want to delete?");
    if (isDelete) {
      const index = this.employeeList.findIndex(m => m.empId == id);
      this.employeeList.splice(index, 1);
      sessionStorage.setItem("EmpData", JSON.stringify(this.employeeList));
      this.onReset();
    }
  }

  onReset() {
    this.employeeObj = new EmployeeModel();
    this.createForm();
  }
}
