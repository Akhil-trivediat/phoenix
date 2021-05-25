import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { Observable, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { map, catchError } from 'rxjs/operators';
import { HttpParams } from "@angular/common/http";
import { RequesterService } from "../../../shared/service/requester.service";

@Injectable({
  providedIn: 'root'
})
export class SensorService {
  
  constructor(
    private http: HttpClient,
    private requesterService: RequesterService,
    @Inject(LOCALE_ID) private locale: string,
  ) { }

  private handleExternalRequestException(error: any) {
    return throwError(error);
  }

  getSensorDetailswithFormattedResponse(sensorID: string) {

    return this.getSensorDetailsbyID(sensorID).pipe(
        map(
            response => {

              let currReading: string = "";

              if(response.readingValue) {
                if(!response.readingValue.toString().includes("e")) {
                  currReading = parseFloat(response.readingValue).toFixed(2) + " " + response.readingUnit;
                }
              }

              return {
                id: response.sensorid,
                name: response.sensorname,
                gatewayName: response.gatewayname,
                readingValue: currReading,
                lastCommDate: formatDate(response.lastCommDate,'MM/dd/yyyy,h:mm a',this.locale),
                location: "",
                minThreshold: response.minThreshold,
                maxThreshold: response.maxThreshold,
                status:  response.status,
                uom: response.readingUnit,
                transmittertype: response.transmittertype,
                humidity: response.humidity ? parseFloat(response.humidity).toFixed(2) + this.getUnitofMeasurment("humi") : ""
              }
            }
        )
    );

  }

  getSensorDetailswithFormattedResponseasPromise(sensorID: string) {

    return this.getSensorDetailsbyIDasPromise(sensorID).then(
      response => {
          return {
              id: response.sensorid,
              name: response.sensorname,
              gatewayName: response.gatewayname,
              readingValue: parseFloat(response.readingValue).toFixed(2) + " " + response.readingUnit,
              lastCommDate: formatDate(response.lastCommDate,'MM/dd/yyyy,HH:mm',this.locale),
              location: "",
              minThreshold: response.minThreshold,
              maxThreshold: response.maxThreshold,
              status:  response.status,
              uom: response.readingUnit,
              transmittertype: response.transmittertype,
              humidity: response.humidity ? parseFloat(response.humidity).toFixed(2) + " %" : ""
          }
      }
    );

  }

  getSensorDetailsbyID(sensorID: string): Observable<any> {

    return this.requesterService.getRequest('/sensor/details' + `?id=${sensorID}`).pipe(
        catchError((error) => {
          return this.handleExternalRequestException(error);
        })
    );

  }

  getSensorDetailsbyIDasPromise(sensorID: string): Promise<any> {

    return this.requesterService.getRequest('/sensor/details' + `?id=${sensorID}`).pipe(
        catchError((error) => {
          return this.handleExternalRequestException(error);
        })
    ).toPromise();

  }

  getDatamessagesbySensorID(sensorID,startDate,endDate): Observable<any> {
    
    return this.requesterService.getSensorDetailsbyIDforGraph('/graphdata',
      {
        ID: sensorID,
        startDate: startDate,
        endDate: endDate
      }
    ).pipe(
        catchError((error) => {
          return this.handleExternalRequestException(error);
        })
    );

  }

  getDatamessagesbySensorIDasPromise(sensorID,startDate,endDate) {
    return this.requesterService.getDatamessagesbySensorIDasPromise('/graphdata',
    {
      ID: sensorID,
      startDate: startDate,
      endDate: endDate
    });
  }

  getUnitofMeasurment(type: string, uom?: string) {

    if(type == "temp") {

      if(uom.toLowerCase() == "celsius") {

        return " °C";

      } else if ( uom.toLowerCase() == "fahrenheit" ) {

        return " °F";

      } else {

        return " ";

      }
    } else if(type == "humi") {

      return " %";

    } else {

      return " ";

    }

  }

}
