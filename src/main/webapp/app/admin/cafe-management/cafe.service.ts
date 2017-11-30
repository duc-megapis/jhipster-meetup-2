import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Cafe } from './cafe.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class CafeService {
    private resourceUrl = 'api/cafes';

    constructor(private http: Http) { }

    create(cafe: Cafe): Observable<Cafe> {
        const copy = this.convert(cafe);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(cafe: Cafe): Observable<Cafe> {
        const copy = this.convert(cafe);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: number): Observable<Cafe> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            return res.json();
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convert(cafe: Cafe): Cafe {
        const copy: Cafe = Object.assign({}, cafe);
        return copy;
    }
}
