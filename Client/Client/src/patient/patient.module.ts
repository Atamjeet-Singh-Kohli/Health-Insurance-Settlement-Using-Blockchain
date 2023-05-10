import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientRoutingModule } from './patient-routing.module';
import { PatientDashboardComponent } from './patient-dashboard/patient-dashboard.component';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { UtilsModule } from 'src/utils/utils.module';
import { HeaderComponent } from './patient-dashboard/header/header.component';
import { SidebarComponent } from './patient-dashboard/sidebar/sidebar.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { ViewRecordsComponent } from './view-records/view-records.component';
import { RecordComponent } from './view-records/record/record.component';
import { BillsComponent } from './bills/bills.component';


@NgModule({
  declarations: [
    PatientDashboardComponent,
    DashboardHomeComponent,
    HeaderComponent,
    SidebarComponent,
    AppointmentsComponent,
    ViewRecordsComponent,RecordComponent,BillsComponent

  ],
  imports: [
    CommonModule,
    PatientRoutingModule,UtilsModule
  ]
})
export class PatientModule { }
