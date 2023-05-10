import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.sass']
})
export class SidenavComponent implements OnInit {
  @Input() path!: string | undefined;
  collapsed: boolean = true;
  constructor() { }

  ngOnInit(): void {
  }

}
