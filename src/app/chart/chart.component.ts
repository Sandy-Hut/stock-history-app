import { Component, OnInit } from '@angular/core'
import * as Highcharts from 'highcharts'  // import all packages from highchart
import { StockService } from '../stock.service'

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  highcharts:any;
  chartOptions:any;
  dataObj:any;
  selectedTab:any;
  activeTab = 'week';
  loaded:boolean = false;
  // initialize the stock symbol with first value
  symbol:string = 'AAPL';
  // list is static for demo purpose, you can add a backend service for getting all the stock symbols
  symbols:string[] = ['AAPL','CVGW','ANGO','CAMP','LNDC','MOS','NEOG','SONC','TISI','FDO','FC','RECN','RELL','UNF',  'WOR','ZEP','AEHR']  
  constructor(private stockService: StockService) { }

  ngOnInit() {
    this.highcharts = Highcharts;
    this.serviceRequest(new Date(),7);
    this.selectedTab = 'week';
  }
  // service call to fetch chart data
  serviceRequest(date,days){
    let toDate = this.formatDate(new Date(),null)
    let fromDate = this.formatDate(date,days);
    this.stockService.getData(fromDate,toDate,this.symbol).subscribe(
      data => {
        console.log(data);
        if(data){
          let keys = this.formatXAxisLabels(Object.keys(data['history']));
          let arr = []
          for(let i in data['history']){
            arr.push(parseFloat(data['history'][i].open));
          }
          this.dataObj = {data:arr,name:data['name'],keys:keys};
          this.drawChart(this.dataObj)
          this.loaded = true; 
        }
      }
    )
  }
  // select symbol value from the dropdown
  selectSymbol(value){
    this.symbol = value;
    if(this.selectedTab==='week'){
      this.ShowLastWeekChart('week')
    }else if(this.selectedTab==='month'){
      this.ShowLastMonthChart('month')
    }else{
      this.ShowLast6MonthsChart('months')
    }
  }
  formatXAxisLabels(keys){
    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let format:string[] = [];
    for(let i=0; i<keys.length; i++){
      let cusStr = new Date(keys[i]).getDate() + ' ' + months[new Date(keys[i]).getMonth()];
      format.push(cusStr);
    }
    return format;
  }
  formatDate(date,days){
    let actDate = days?new Date(date.getTime() - (days * 24 * 60 * 60 * 1000)):date;
    let day =actDate.getDate();
    let month=actDate.getMonth()+1;
    let year=actDate.getFullYear();
    if(day<10) {day='0'+day}
    if(month<10) {month='0'+month}
    return `${year}-${month}-${day}`;
  }
  addMonths(date, months) {
    date.setMonth(date.getMonth() + months);
    return date;
  }
  ShowLastWeekChart(activeTab){
    this.serviceRequest(new Date(),7);
    this.selectedTab = this.activeTab = activeTab;
  }
  ShowLastMonthChart(activeTab){
    let dateBeforeMonth = this.addMonths(new Date(),-1)
    this.serviceRequest(dateBeforeMonth,null);
    this.selectedTab = this.activeTab = activeTab;
  }
  ShowLast6MonthsChart(activeTab){
    let dateBeforeMonths = this.addMonths(new Date(),-6)
    this.serviceRequest(dateBeforeMonths,null);
    this.selectedTab = this.activeTab = activeTab;
  }
  // draw actual chart
  drawChart(options){
    this.chartOptions = {   
      chart: {
        type: 'spline'
      },
      title: {
        text: 'Average Stock Data'
      },
      subtitle: {
        text: 'Source: worldtradingdata.com'
      },
      xAxis: {
        title:{
          text: 'Date'
        },
        categories: options.keys
      },
      yAxis: {          
        title:{
          text: 'Stock open value'
        },
        categories: options.data
      },
      series:[
        {
          name:options.name,
          data:options.data
        }
      ],
      tooltip: {
        valueSuffix:'°'
      }
    };
  }
}
