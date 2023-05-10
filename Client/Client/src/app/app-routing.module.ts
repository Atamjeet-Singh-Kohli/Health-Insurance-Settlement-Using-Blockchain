import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentComponent } from './appointment/appointment.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'appointment',
    component: AppointmentComponent,
  },
  { path: 'register', component: RegisterComponent },
  {
    path: 'admin',
    loadChildren: () =>
      import('../admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'doctor',
    loadChildren: () =>
      import('../doctor/doctor.module').then((m) => m.DoctorModule),
  },
  {
    path: 'insurance',
    loadChildren: () =>
      import('../insurance/insurance.module').then((m) => m.InsuranceModule),
  },
  {
    path: 'patient',
    loadChildren: () =>
      import('../patient/patient.module').then((m) => m.PatientModule),
  },
  { path: '**', component: HomeComponent, redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
