import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AgentService} from '../services/agent.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  route: string | undefined = '';
  isAgent: boolean = false;

  prgMsg: string = 'Checking is Agency'
  prgSuccess: boolean = false
  prgWarning: boolean = false
  prgBtnText: string = 'DONE'

  constructor(
    private as: AgentService,
    private ar: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.checkIsAgent()
  }

  ngAfterViewInit(): void {

  }

  checkIsAgent() {
    this.prgMsg = 'Checking is Agency'
    this.as.checkIsAgent().then(r => {
      this.isAgent = r
      console.log(r)
      if (this.isAgent) {
        this.router.navigate(['insurance/home'])
        this.route = this.ar.children[0]?.snapshot.routeConfig?.path;
        this.router.events.subscribe((val) => {
          this.route = this.ar.children[0]?.snapshot.routeConfig?.path;
        });
      }
      else {
        this.prgWarning = true
        this.prgMsg = "Only Agency Have Access to this page"
      }

    }).catch(er => {
      this.prgWarning = true
      this.prgMsg = "Only Agency Have Access to this page"

    })
  }

  onPrgBtnClick() {

    this.prgSuccess = false
    this.prgWarning = false
    this.prgMsg = "Loading...."
  }
}
