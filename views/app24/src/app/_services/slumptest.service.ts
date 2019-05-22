import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SlumpService {
    constructor(private http: HttpClient) { }
    
    registerTest(value, equipment, projectid, threshold){
        return this.http.post(environment.apiUrl + '/slumptest', {value: value, equipment: equipment, project: projectid, threshold: threshold})
    }
    getTests(projectId){
        return this.http.get(environment.apiUrl + '/slumptest?project='+projectId);
    }
}