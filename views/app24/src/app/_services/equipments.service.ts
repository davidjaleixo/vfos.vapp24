import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EquipmentService {
    constructor(private http: HttpClient) { }
    create(newName: String, projectId: String) {
        console.log("name: ", newName);
        console.log("projectId: ", projectId);

        return this.http.post(environment.apiUrl + '/equipments', { name: newName, projectid: projectId })
    }
    getAll(projectId) {
        return this.http.get(environment.apiUrl + '/equipments?project=' + projectId)
    }
    delete(eqId: String) {
        return this.http.delete(environment.apiUrl + '/equipments?id=' + eqId)
    }
}