import { Component, OnInit } from '@angular/core';
import { BlockchainService } from 'src/services/blockchain.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass'],
})
export class RegisterComponent implements OnInit {
  model: any = {
    patID: '',
    fName: 'test_name',
    lName: 'test_name',
    phone: '123456789',
    city: 'city',
    state: 'state',
  };

  show: boolean = false;
  msg_text: string = '';
  warn: boolean = false;
  success: boolean = false;

  ipfs: any;

  constructor(private blockchainService: BlockchainService) {}

  ngOnInit(): void {}

  onSubmit() {
    this.show = true;
    this.msg_text = 'Adding Patient to the Network...';
    console.log(this.model);
    // this.checkAddProgress()
    this.blockchainService
      .addPatient(this.model.patID, this.model)
      .then((r) => {
        console.log(r);
        this.msg_text = 'Patient Added to the network'
        this.success = true
      })
      .catch((err) => {
        console.log(err);
        this.msg_text = 'Failed to add pateint to network'
        this.warn = true
      });
  }

  onClose() {
    this.show = false;
    this.warn = false;
  }
}
