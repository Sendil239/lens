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
}