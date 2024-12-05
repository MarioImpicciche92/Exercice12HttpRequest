import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';


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
  
  private placesService = inject(PlacesService);
  private destroyRef=inject(DestroyRef);

  ngOnInit(): void {
      const subscription=this.placesService.loadAvailablePlaces().subscribe({
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

  onSelectPlace(selectedPlace: Place){
   this.placesService.addPlaceToUserPlaces(selectedPlace.id).subscribe({
  next:(resData) => console.log(resData)
});
  }
  
}
function resData(value: { places: Place[]; }, index: number): unknown {
  throw new Error('Function not implemented.');
}

