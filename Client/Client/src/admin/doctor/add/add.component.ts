import { Component, OnInit } from '@angular/core';
import { rejects } from 'assert';
import { FILE, resolve } from 'dns';

import { NgxImageCompressService } from 'ngx-image-compress';
import { DoctorService } from 'src/admin/services/doctor.service';

import { specialities } from 'src/utils/Doctor_Specialities';
// declare let window: any;
// const { ethereum } = window;

@Component({
  selector: 'doctor-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.sass'],
})
export class AddComponent implements OnInit {
  model: any = {
    docID: '',
    fName: 'test_name',
    lName: 'test_name',
    Doj: '',
    emailID: 'test_name@mail.com',
    phone: '123456789',
    city: 'city',
    state: 'state',
    department: '',
  };

  image_url: any;
  imageCompressedUrl: string = '';

  show: boolean = false;
  msg_text: string = '';
  warn: boolean = false;
  success: boolean = false;

  ipfs: any;

  Specialities = specialities;

  constructor(
    private imageCompress: NgxImageCompressService,
    private doctorService: DoctorService
  ) {}

  ngOnInit(): void {
    this.ipfs = this.doctorService.ipfs;

  }

  onAddDocSubmit() {
    this.show = true;
    this.msg_text = 'Adding Doctor to the Network....';
    this.warn = false;


    let form = new FormData();
    form.append('fName', ""+this.model.fName);
    form.append('lName', ""+this.model.lName);
    form.append('Doj', ""+this.model.Doj);
    form.append('emailID', ""+this.model.emailID);
    form.append('city', ""+this.model.city);
    form.append('state', ""+this.model.state);
    form.append('docID', ""+this.model.docID);
    form.append('department', ""+this.model.department);
    form.append('image', this.model.image);

    this.doctorService.addDoctor(form).then((data: any) => {
      console.log(data);
      if (data.status == 'success') {
        this.msg_text += '<br>User Added to the Blockchain';
        console.log('User added Successfully');
        this.success = true;
        this.model = {};
      } else {
        this.warn = !this.warn;
        this.msg_text =
          'Adding Doctor Failed<br> <small class="fw-light text-danger"><b>"</b>' +
          this.model.docID +
          '<b>"</b></small><br>1.not a valid address or <br>2.Already have a role';
      }
    });
  }

  PreviewImage(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.image_url = event.target.result;
        this.compressImage();
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  compressImage() {
    this.imageCompress
      .compressFile(this.image_url, 50, 50)
      .then((compressedImage) => {
        console.log(compressedImage);

        this.imageCompressedUrl = compressedImage;
        this.image_url = this.imageCompressedUrl;
        this.dataURItoBlob(compressedImage).then((blob: any) => {
          this.model.image = new File([blob], 'user-image_.jpg', {
            type: 'image/png',
          });
          console.log(this.model.image);
        });
      })
      .catch((er) => {
        console.log(er);
      });
  }

  onClose() {
    this.show = false;
    this.warn = false;
  }

  async dataURItoBlob(dataURI: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const byteString = window.atob(dataURI.replace(/^[^,]+,/, ''));
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const int8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        int8Array[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([int8Array], { type: 'image/png' });
      resolve(blob);
    });
  }
  
}
