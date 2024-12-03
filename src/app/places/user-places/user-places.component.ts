import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';


@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {
   places = signal<Place[] | undefined>(undefined);
  isFetching=signal(false);
  private httpClient= inject(HttpClient);
   private destroyRef=inject(DestroyRef);

  
 ngOnInit(): void {
      const subscription=this.httpClient.get<{places:Place[]}>
      ('http://localhost:3000/user-places')
      .pipe(map((resData) => resData.places)).subscribe({
        next:(places) => {
          this.places.set(places)
          console.log(places);
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

