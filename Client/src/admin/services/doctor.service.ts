import {JsonPipe} from "@angular/common";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {rejects} from "assert";
import {resolve} from "dns";
import {exit} from "process";
import {from, Observable} from "rxjs";
import {BlockchainService} from "src/services/blockchain.service";
import {IpfsService} from "src/services/ipfs.service";
import Web3 from "web3";

const Contract = require("../../../build/contracts/Contract.json");

@Injectable({
    providedIn: "root",
})
export class DoctorService {
    API = "http://localhost:8000/api/doctor/";

    web3: any;
    abi: any = {};
    netWorkData: any = {};
    netId: any;
    address: any;
    contract: any;
    account: any;

    ipfs: any;

    msg_text: string = "";

    result: any;

    Doctors: any;

    DoctorDetails: string[] = [];

    drInfoload: boolean = false;

    constructor(
        private blockChainService: BlockchainService,
        private ipfsService: IpfsService,
        private http: HttpClient
    ) {
        //GET BlockChain Service
        this.web3 = blockChainService.getWeb3();

        this.web3.eth.getAccounts((err: any, accs: any) => {
            this.account = accs[0];
        });

        this.web3.eth.net.getId().then((r: number) => {
            this.netId = r;
            this.abi = Contract.abi;
            this.netWorkData = Contract.networks[this.netId];

            console.log(this.netWorkData);

            if (this.netWorkData) {
                this.address = this.netWorkData.address;
                this.contract = new this.web3.eth.Contract(this.abi, this.address);

                console.log(this.contract.methods.getAdmin.call());
                this.Doctors = this.contract.methods.getAllDrs
                    .call()
                    .then((docs: string[]) => {
                        this.Doctors = docs;
                        console.log(this.Doctors);
                    });
                console.log("Doctors", this.Doctors);
            } else {
                console.log("Contract not Deployed");
            }
        });

        //IPFS
        this.ipfs = ipfsService.getIPFS();
    }

    addDoctor(data: FormData): Promise<any> {
        return new Promise((resolve, reject) => {
            console.log(data.get("docID"));
            this.blockChainService.getContract().then(c => {
                c.methods
                    .addDoctor(data.get("docID"))
                    .send({from: this.account})
                    .on("confirmation", (r: any) => {
                        this.http.post(this.API, data).subscribe((result) => {
                            resolve(result);
                        });
                    })
                    .on("error", (error: any) => {
                        console.log(error);
                        reject(error);
                    });
            })

        });
    }

    deleteDoctor(id: any, docID: any): Promise<any> {
        console.log(id);

        return new Promise((resolve, reject) => {
            this.http.delete(this.API + docID + "/").subscribe((res: any) => {
                console.log(res);
                if (res.data) {
                    this.contract.methods
                        .delDoctor(docID)
                        .send({from: this.account})
                        .on("confirmation", (r: any) => {
                            this.http.delete(this.API + docID + "/").subscribe((res: any) => {
                                if (res.data) {
                                    resolve(true);
                                }
                            });
                        });
                } else {
                    reject(false);
                }
            });
        });
    }

    getDoctors() {
        return this.http.get(this.API);
    }
}
