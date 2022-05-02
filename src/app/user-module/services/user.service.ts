import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, combineLatest, throwError as observableThrowError, Observable, of } from 'rxjs';
import { catchError, map, retryWhen, tap } from 'rxjs/operators';

import { genericRetryStrategy } from './generic-retry-strategy';
import { State } from '../models/state.model';
import { Contact } from '../models/contact.model';

@Injectable()
export class UserService {

    //@ts-ignore 2339
    private apiUrl = window._env_.API_URL;

    private states = new BehaviorSubject<State[]>([]);
    states$ = this.states.asObservable();
    private users = new BehaviorSubject<Contact[]>([]);
    users$ = this.users.asObservable();

    private dataCaching: { // milliseconds data is allowed to remain cached before next request for that data re-retrieves it from the remote data source
        defaultLong: 86400000, // Default for data that rarely or never changes such as a list of states (one day)
        defaultShort: 60000, // Default for data that changes frequently, but still worth caching (one minute)
        userData: 600000 // 10 minutes
    }

    private lastStateDataRetreivalTime: number; // Time when user data was last retireved from the remote souce
    private lastUserDataRetreivalTime: number; // Time when user data was last retireved from the remote souce

    constructor(private http: HttpClient) {
        console.log(`apiUrl: ${this.apiUrl}`)
    }

    public getUsers(force: boolean = false): Observable<Contact[]> {
        if (force || this.users.getValue().length === 0 || Date.now() - this.lastUserDataRetreivalTime > this.dataCaching.userData) {
            this.http.get<Contact[]>(`${this.apiUrl}/contacts?$top=100`) //Limiting to 100 contacts only for demo purposes
                .pipe(
                    retryWhen(genericRetryStrategy()),
                    tap((users: Contact[]) => {
                        this.lastUserDataRetreivalTime = Date.now();
                        // Caller can subscribe to users$ to retreive the users any time they are updated
                        this.users.next(users);
                        console.log(`GET users`);
                    }),
                    catchError(this.handleError)
            ).subscribe();
        }
        return this.users$;
    }

    public getStates(force: boolean = false): Observable<State[]> {
        if (force || this.states.getValue().length === 0 || Date.now() - this.lastStateDataRetreivalTime > this.dataCaching.defaultLong) {
            this.http.get(`./assets/states.json`).pipe(
                retryWhen(genericRetryStrategy()),
                tap((states: State[]) => {
                    this.lastStateDataRetreivalTime = Date.now();
                    // Caller can subscribe to states$ to retreive the states any time they are updated
                    this.states.next(states);
                    console.log(`GET states`);
                }),
                catchError(this.handleError)
            ).subscribe();
        }
        return this.states$;
    }

    public updateUser(user: Contact): Observable<boolean> {
        this.http.put<Contact>(`${this.apiUrl}/contacts/${user.id}`, user)
        .pipe(
            retryWhen(genericRetryStrategy()),
            tap(() => {
                // Update the user in the users array
                let users = this.users.getValue();
                let index = users.findIndex(u => u.id === user.id);
                users[index] = user
                this.lastUserDataRetreivalTime = Date.now();
                // Caller can subscribe to users$ to retreive the users any time they are updated
                this.users.next(users);
                console.log(`PATCH user`);
            }),
            catchError(this.handleError)
        ).subscribe();

        // Since we don't have a backend API in this demo, we will use localStorage instead
        const users = this.users.getValue();
        users.map(u => user.id === u.id ? user : u);
        localStorage.setItem('users', JSON.stringify(users));
        this.users.next(users);
        return of(true);
    }

    private handleError(error: Response) {
        // In the future, we may send the server to some remote logging infrastructure
        console.error(error);
        return observableThrowError(error || 'Server error');
    }

}
