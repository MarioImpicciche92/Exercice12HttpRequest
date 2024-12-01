import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent]
  
})
export class AvailablePlacesComponent implements OnInit{
  places = signal<Place[] | undefined>(undefined);
  isFetching=signal(false);
  error=signal('');
  
  private httpClient= inject(HttpClient);
  private destroyRef=inject(DestroyRef);

  ngOnInit(): void {
      const subscription=this.httpClient.get<{places:Place[]}>
      ('http://localhost:3000/places')
      .pipe(map((resData) => resData.places),
      catchError((error) => throwError(() => {
        new Error()
      }))
    ).subscribe({
        next:(places) => {
          this.places.set(places)
          console.log(places);
        },
        error: (error) =>
        {
          this.error.set("Something went wrong fetching the avaibles places.Please try again later.")
        },
        complete:() =>{
          this.isFetching.set(true);
        }
        
      })
      
      this.destroyRef.onDestroy(()=>{
        subscription.unsubscribe();
      })
  }
}
function resData(value: { places: Place[]; }, index: number): unknown {
  throw new Error('Function not implemented.');
}

