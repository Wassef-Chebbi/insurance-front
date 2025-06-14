// src/app/services/user.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private baseUrl = 'http://localhost:8080/api/user'; // adjust base if needed

    constructor(private http: HttpClient) { }

    /** Add a new user (Admin only) */
    addUser(user: User): Observable<User> {
        return this.http.post<User>(`${this.baseUrl}`, user);
    }

    /** Get user by ID */
    getUserById(userId: number): Observable<User> {
        return this.http.get<User>(`${this.baseUrl}/${userId}`);
    }

    /** Get all users */
    getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.baseUrl);
    }


    /** Update a user */
    updateUser(userId: string, user: User): Observable<User> {
        return this.http.put<User>(`${this.baseUrl}/${userId}`, user);
    }

    /** Delete a user */
    deleteUser(userId: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${userId}`);
    }


}
