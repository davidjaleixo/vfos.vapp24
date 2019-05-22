import { Component, OnInit } from '@angular/core';
import { ProjectService, AuthenticationService, EquipmentService, SlumpService } from '../../_services';
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-slumphistory',
  templateUrl: './slumphistory.component.html',
  styleUrls: ['./slumphistory.component.css']
})
export class SlumphistoryComponent implements OnInit {

  slumps: any;
  project: any;
  constructor(
    private slumpservice: SlumpService,
    private projectservice: ProjectService,
    private router: ActivatedRoute) { }

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels = [];
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartData = [
    { data: [], label: '' }
  ];

  ngOnInit() {
    this.projectservice.getProject(this.router.snapshot.paramMap.get("idproject")).subscribe(
      data => {
        this.project = data;

      }, err => {
        console.log(err);
      })
    this.slumpservice.getTests(this.router.snapshot.paramMap.get("idproject")).subscribe(
      data => {
        console.log("response", data);
        this.slumps = data
        this.barChartData[0].label= this.project.name;
        this.slumps.forEach(eachSlump => {
          this.barChartLabels.push(eachSlump.date);
          this.barChartData[0].data.push(eachSlump.value)
        });
      }, err => {

      })
  }

}
