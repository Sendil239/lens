import { Injectable } from '@angular/core';

@Injectable()
export class UtilService {
  constructor() {}

  objectToArray(obj: any){
    const chartObjList = Object.keys(obj).map((key)=> {
        const chartObj = {'name': key, 'value': obj[key]};
        return chartObj;
      });
    return chartObjList;
  }

  objectToArrayData(obj: any){
    const chartObjList = Object.keys(obj).map((key)=> {
        const chartObj = {'name': key, 'y': obj[key]};
        return chartObj;
      });
    return chartObjList;
  }

  objectToArrayWordCloud(obj: any){
    const chartObjList = Object.keys(obj).map((key)=> {
        const chartObj = {'name': key, 'weight': obj[key]};
        return chartObj;
      });
    return chartObjList;
  }

  sortByMonth(arr: any) {
    var months = ["Jan 2021", "Feb 2021", "Mar 2021", "Apr 2021", "May 2021", "Jun 2021",
              "Jul 2021", "Aug 2021", "Sep 2021", "Oct 2021", "Nov 2021", "Dec 2021"];
    arr.sort(function(a: any, b: any){
        return months.indexOf(a.name)
             - months.indexOf(b.name);
    });
  }
}