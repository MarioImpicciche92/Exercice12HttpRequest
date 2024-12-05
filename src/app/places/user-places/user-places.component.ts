import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';


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
  private placeService = inject(PlacesService);
   private destroyRef=inject(DestroyRef);

  
 ngOnInit(): void {
      const subscription=this.placeService.loadUserPlaces().subscribe({
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

