import { Component, OnInit } from '@angular/core';
import { PatientServiceService } from '../services/patient-service.service';

@Component({
  selector: 'app-view-records',
  templateUrl: './view-records.component.html',
  styleUrls: ['./view-records.component.sass'],
})
export class ViewRecordsComponent implements OnInit {
  PatientRecords: any = [];
  PatientRecord: any = [];
  viewRecord: boolean = false;

  progressShow = true;
  progressMsg = 'loading Records';

  constructor(private patientService: PatientServiceService) {}

  ngOnInit(): void {
    this.getPateintRecords();
  }

  getPateintRecords() {
    this.patientService
      .getPatientRecords()
      .then((result: any) => {
        this.PatientRecords = result['MedRecord'];
        this.progressShow = false
        this.progressMsg = ''
      })
      .catch((err: any) => {
        console.log(err);
        this.progressShow = false
        this.progressMsg = 'No record found'
      });
  }

  onViewRecord(record: any) {
    this.PatientRecord = record;
    console.log(this.PatientRecord.data);
    this.viewRecord = true;
  }

  onRecordClose() {
    this.PatientRecord = {};
    this.viewRecord = false;
  }
}
