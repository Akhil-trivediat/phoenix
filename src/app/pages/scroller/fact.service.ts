import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import 'rxjs/add/observable/of';

@Injectable()
export class FactService {
    getRandomFact(): Observable<any> {
        return Observable.of(Math.random()*100 + 10);
    }   
}