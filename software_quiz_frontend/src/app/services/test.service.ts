import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: "root"
})
export class TestService {

    constructor(
        private httpClient: HttpClient
    ) {}

    public getCollection(): any {
        return this.httpClient.get<any>("api/quiz/get");
    }
}