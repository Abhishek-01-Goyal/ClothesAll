import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { response } from 'express';
import { map, Observable, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClothesAllFormService {

  private countriesUrl = environment.clothesAllApiUrl +  '/countries';
  private statesUrl =  environment.clothesAllApiUrl + '/states';

  constructor(private httpClient: HttpClient) {}

  getCountries(): Observable<Country[]>{
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    );
  }

  getStates(theCountryCode: string): Observable<State[]>{
    const searchStatesUrl = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;
    
    return this.httpClient.get<GetResponseStates>(searchStatesUrl).pipe(
      map(response => response._embedded.states)
    );  
  }

  getCreditCardMonths(startMonth: number): Observable<number[]> {
    // Create an array to hold the month numbers
    let data: number[] = [];

    // Build an array for the dropdown list
    // Start with the startMonth passed in and loop until December (12)
    for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth);
    }

    // Use the 'of' operator to wrap the array into an Observable
    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {
    let data: number[] = [];

    const startYear: number = new Date().getFullYear();
    const endyear: number = startYear + 10;

    for (let theYear = startYear; theYear <= endyear; theYear++) {
      data.push(theYear);
    }

    // Use the 'of' operator to wrap the array into an Observable
    return of(data);
  }


}

interface GetResponseCountries{
  _embedded:{
    countries: Country[];
  }
}

interface GetResponseStates{
  _embedded:{
    states: State[];
  }
}
