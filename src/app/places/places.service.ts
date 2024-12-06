import { inject, Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);

  loadedUserPlaces = this.userPlaces.asReadonly();
  private httpClient=inject(HttpClient);

  loadAvailablePlaces() {
     return this.fetchPlace(
      'http://localhost:3000/places',
      'Something went wrong fetching the avaibles places.Please try again later.'
    )
  }

  loadUserPlaces() {
    return this.fetchPlace(
      'http://localhost:3000/user-places',
      'Something went wrong fetching your favorite places.Please try again later.'
    )
  }

  addPlaceToUserPlaces(placeId:string) {
    return this.httpClient.put('http://localhost:3000/user-places',{
      placeId
})
  }

  removeUserPlace(place: Place) {}

  private fetchPlace(url:string,erroMessage:string){
    return this.httpClient.get<{places:Place[]}>
      (url)
      .pipe(map((resData) => resData.places),
      catchError((error) => throwError(() => {
        new Error()
      }))
    )
  }
}
