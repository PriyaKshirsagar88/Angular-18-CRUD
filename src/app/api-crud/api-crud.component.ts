import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeModel } from '../model/Employee';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-api-crud',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './api-crud.component.html',
  styleUrl: './api-crud.component.css'
})
export class ApiCRUDComponent implements OnInit { // Implement OnInit

  employeeForm!: FormGroup; // Use definite assignment assertion (!)
  employeeObj: EmployeeModel = new EmployeeModel();
  employeeList: EmployeeModel[] = [];
  apiUrl = 'https://67a5cc2fc0ac39787a1f7c43.mockapi.io/employeeform/employees';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient
  ) { }

  ngOnInit(): void { // Use ngOnInit lifecycle hook
    this.createForm();
    this.loadData();
  }

  loadData() {
    this.getEmployees().subscribe({ // Use object form for subscribe
      next: (data) => {
        this.employeeList = data;
      },
      error: (error) => {
        console.error('Error loading data:', error);
      }
    });
  }

  getEmployees(): Observable<EmployeeModel[]> {
    return this.http.get<EmployeeModel[]>(this.apiUrl);
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
    if (this.employeeForm.valid) {
      const newEmployee = this.employeeForm.value;
      this.createEmployee(newEmployee).subscribe({
        next: () => {
          this.loadData();
          this.onReset();
        },
        error: (error) => {
          console.error("Error saving employee:", error);
          // Handle the error appropriately, e.g., display a message to the user
        }
      });
    }
  }

  createEmployee(employee: EmployeeModel): Observable<EmployeeModel> {
    return this.http.post<EmployeeModel>(this.apiUrl, employee);
  }

  onEdit(item: EmployeeModel) {
    this.employeeObj = { ...item };
    this.createForm();
  }

  onUpdate() {
    if (this.employeeForm.valid) {
      const updatedEmployee = this.employeeForm.value;
      const empId = updatedEmployee.empId;

      this.updateEmployee(empId, updatedEmployee).subscribe({
        next: () => {
          this.loadData();
          this.onReset();
        },
        error: (error) => {
          console.error("Error updating employee:", error);
        }
      });
    }
  }

  updateEmployee(id: number, employee: EmployeeModel): Observable<EmployeeModel> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<EmployeeModel>(url, employee);
  }

  onDelete(id: number) {
    const isDelete = confirm("Are you sure you want to delete?");
    if (isDelete) {
      this.deleteEmployee(id).subscribe({
        next: () => {
          this.loadData();
        },
        error: (error) => {
          console.error("Error deleting employee:", error);
        }
      });
    }
  }

  deleteEmployee(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }

  onReset() {
    this.employeeObj = new EmployeeModel();
    this.createForm();
  }
}