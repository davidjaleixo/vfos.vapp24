import { Component, OnInit } from '@angular/core';
import { ProjectService, AuthenticationService, SupplierService, SlumpService } from '../../_services';
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { forEach } from '@angular/router/src/utils/collection';

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
  public barChartData = [{ data: [], label: '' }];

  private barras = [];

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
        // this.slumps.forEach((eachRecord, id, arr) => {
        //   //search the label ignoring the first cas
        //   if (this.barras.length == 0) {
        //     console.log("First ", eachRecord.compositionname);
        //     this.barras.push({ data: [eachRecord.value], label: eachRecord.compositionname })
        //   } else {
        //     console.log("size:", this.barras.length);
        //     this.barras.forEach((eachBarChart, index, array) => {
        //       setTimeout(() => {
        //         console.log("this composition ", eachRecord.compositionname, " vs  this label", eachBarChart.label)
        //         let found = false;
        //         if (eachBarChart.label == eachRecord.compositionname) {
        //           //apply the data here
        //           eachBarChart.data.push(eachRecord.value)
        //           found = true;
        //           console.log("we have found the place for ", eachRecord.compositionname)
        //           console.log("----", this.barras);
        //           return
        //         }

        //         if (index === (array.length - 1) && !found) {
        //           console.log("adding for", eachRecord.compositionname);
        //           this.barras.push({ data: [eachRecord.value], label: eachRecord.compositionname })

        //         }
        //       }, 500)

        //     })
        //   }
        //   if (id === (arr.length - 1)) {
        //     console.log("->", this.barras);
        //     this.barChartData = this.barras;
        //   }
        // });
        // this.barChartData[0].label= this.project.name;
        // this.slumps.forEach(eachSlump => {
        //   this.barChartLabels.push(eachSlump.date);
        //   this.barChartData[0].data.push(eachSlump.value)
        // });
      }, err => {

      })
  }

}
