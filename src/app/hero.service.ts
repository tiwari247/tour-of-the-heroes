import { Injectable } from '@angular/core';
import { Observable, of } from "rxjs";
import { catchError, tap } from "rxjs/operators";
// import { handleError } from "rxjs/operator";
import { Hero } from "./heroes/hero";
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { InMemoryDataService } from './in-memory-data.service';

@Injectable({
    providedIn: "root"
})
export class HeroService{

    private heroesUrl = 'api/heroes';  // URL to web api
    
    constructor(private messageService: MessageService,
        private httpClient: HttpClient){
    }

    getHeroes(): Observable<Hero[]>{
        // this.log();
        
        return this.httpClient.get<Hero[]>(this.heroesUrl)
            .pipe(
                tap(_ => this.log("HeroService : Fetched HEROES")),
                catchError(this.handleError<Hero[]>('getHeroes', []))
            );
    }

    getHero(id: number): Observable<Hero> {
        const url = `${this.heroesUrl}/${id}`;
        return this.httpClient.get<Hero>(url).pipe(
          tap(_ => this.log(`fetched hero id=${id}`)),
          catchError(this.handleError<Hero>(`getHero id=${id}`))
        );
    }

    /** POST: add a new hero to the server */
    addHero (hero: Hero): Observable<Hero> {
        return this.httpClient.post<Hero>(this.heroesUrl, hero, {headers: new HttpHeaders({"Content-Type":"application/json"})}).pipe(
        tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
        catchError(this.handleError<Hero>('addHero'))
        );
    }

    updateHero(hero): Observable<Hero>{
        // const url = `${this.heroesUrl}/${id}`;
        return this.httpClient.put(this.heroesUrl, hero, {headers: new HttpHeaders({"Content-Type":"application/json"})})
            .pipe(
                tap(_ => this.log(`updated hero id=${hero.id}`)),
                catchError(this.handleError<any>('updateHero'))
            );
    }

/** DELETE: delete the hero from the server */
    deleteHero (hero: Hero | number): Observable<Hero> {
        const id = typeof hero === 'number' ? hero : hero.id;
        const url = `${this.heroesUrl}/${id}`;
    
        return this.httpClient.delete<Hero>(url, {headers: new HttpHeaders({"Content-Type":"application/json"})}).pipe(
        tap(_ => this.log(`deleted hero id=${id}`)),
        catchError(this.handleError<Hero>('deleteHero'))
        );
    }

    /* GET heroes whose name contains search term */
    searchHeroes(term: string): Observable<Hero[]> {
        if (!term.trim()) {
        // if not search term, return empty hero array.
        return of([]);
        }
        return this.httpClient.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
        tap(_ => this.log(`found heroes matching "${term}"`)),
        catchError(this.handleError<Hero[]>('searchHeroes', []))
        );
    }

    private log(message:string){
        this.messageService.addMessage(message);
    }

    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
      
          // TODO: send the error to remote logging infrastructure
          console.error(error); // log to console instead
      
          // TODO: better job of transforming error for user consumption
          this.log(`${operation} failed: ${error.message}`);
      
          // Let the app keep running by returning an empty result.
          return of(result as T);
        };  
    }
}