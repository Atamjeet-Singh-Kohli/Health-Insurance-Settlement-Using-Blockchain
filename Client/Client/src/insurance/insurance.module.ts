import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InsuranceRoutingModule } from './insurance-routing.module';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { UtilsModule } from 'src/utils/utils.module';
import {DoctorModule} from "../doctor/doctor.module";


@NgModule({
  declarations: [DashboardComponent, SidenavComponent, HomeComponent],
    imports: [
        CommonModule,
        InsuranceRoutingModule, UtilsModule, DoctorModule
    ]
})
export class InsuranceModule { }
