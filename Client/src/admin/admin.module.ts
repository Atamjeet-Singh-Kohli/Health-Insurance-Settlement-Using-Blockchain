import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { SidebarComponent } from './admin-dashboard/sidebar/sidebar.component';
import { HeaderComponent } from './admin-dashboard/header/header.component';
import { DoctorComponent } from './doctor/doctor.component';
import { ViewComponent } from './doctor/view/view.component';
import { AddComponent } from './doctor/add/add.component';
import { FormsModule } from '@angular/forms';
import { NgxImageCompressService } from 'ngx-image-compress';
import { DoctorService } from './services/doctor.service';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { CardComponent } from './dashboard-home/card/card.component';
import { PatientComponent } from './patient/patient.component';
import { UtilsModule } from 'src/utils/utils.module';
import { AppointmentComponent } from './appointment/appointment.component';
import { InsuranceComponent } from './insurance/insurance.component';
import { BillComponent } from './bill/bill.component';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    SidebarComponent,
    HeaderComponent,
    DoctorComponent,
    ViewComponent,
    AddComponent,
    DashboardHomeComponent,
    CardComponent,
    PatientComponent,
    AppointmentComponent,
    InsuranceComponent,
    BillComponent
  ],
  imports: [CommonModule, AdminRoutingModule, FormsModule,UtilsModule],
  providers: [NgxImageCompressService,DoctorService],
})
export class AdminModule {}
