import { DatePipe } from '@angular/common';
import {
  Component,
  AfterViewInit,
  ViewChild,
  OnInit,
  TemplateRef,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EmpList } from './shared/models/empList';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit, OnInit {
  tableColoumns: string[] = [
    '#',
    'empName',
    'jobTitle',
    'age',
    'startDate',
    'endDate',
    'action',
  ];
  @ViewChild('addDialog', { static: false })
  addDialog: TemplateRef<HTMLElement>;
  @ViewChild('viewDialog', { static: false })
  viewDialog: TemplateRef<HTMLElement>;
  name: any = '';
  jobTitle: any = '';
  age: any = '';
  endDate: any = '';
  startDate: any = '';
  dataSource: MatTableDataSource<EmpList>;
  users = [
    {
      empName: 'Utkarsh',
      jobTitle: 'Software Developer',
      age: '28',
      startDate: Date(),
      endDate: Date(),
    },
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  empForm: FormGroup;
  constructor(public dialog: MatDialog, private fb: FormBuilder) {}
  ngOnInit(): void {
    this.empForm = this.fb.group({
      empName: ['', [Validators.required]],
      jobTitle: ['', [Validators.required]],
      age: ['', [Validators.required, Validators.max(99)]],
      startDate: ['', [Validators.required]],
      endDate: [''],
    });
    this.dataSource = new MatTableDataSource(this.users);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  onSubmit(form: FormGroup) {
    if (form.invalid) return;
    this.dialog.closeAll();
    this.users.push(form.value);
    this.dataSource = new MatTableDataSource(this.users);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.empForm.reset();
  }
  deleteItem(row: any) {
    if (this.users.length == 1) {
      return;
    }
    const index = this.users.indexOf(row);
    if (index > -1) {
      this.users.splice(index, 1);
    }
    this.dataSource = new MatTableDataSource(this.users);
  }

  search() {
    let a = this.users;
    if (this.name) {
      a = a.filter((a) => a.empName.includes(this.name));
    }
    if (this.age) {
      a = a.filter((a) => a.age.includes(this.age));
    }
    if (this.jobTitle) {
      a = a.filter((a) => a.jobTitle.includes(this.jobTitle));
    }
    if (this.startDate) {
      a = a.filter(
        (a) =>
          this.onlyDate(new Date(a.startDate).getTime()) >=
          this.onlyDate(new Date(this.startDate).getTime())
      );
    }
    if (this.endDate) {
      a = a.filter(
        (a) =>
          this.onlyDate(
            new Date(a.endDate).getTime() || new Date(this.endDate).getTime()
          ) <= this.onlyDate(new Date(this.endDate).getTime())
      );
    }
    this.dataSource = new MatTableDataSource(a);
  }
  onlyDate(dateTime: any) {
    var date = new Date(dateTime);
    date.setHours(0, 0, 0, 0);
    return date;
  }
  clear() {
    this.name = '';
    this.jobTitle = '';
    this.age = '';
    this.endDate = new Date();
    this.startDate = '';
    this.dataSource = new MatTableDataSource(this.users);
  }

  addItem() {
    this.empForm.reset();
    this.dialog.open(this.addDialog, {
      width: '30vw',
      maxWidth: '50vw',
    });
  }
  viewDetail(val: any) {
    this.empForm.patchValue(val);
    this.dialog.open(this.viewDialog, {
      width: '30vw',
      maxWidth: '50vw',
    });
  }

  datePipe(date: any) {
    var datePipe = new DatePipe(date);
    return datePipe.transform(date, 'MM/DD/YYYY');
  }
}
