import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { Asset } from './asset.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class AssetService {

    private resourceUrl = SERVER_API_URL + 'api/assets';

    constructor(private http: Http) { }

    create(asset: Asset): Observable<Asset> {
        const copy = this.convert(asset);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(asset: Asset): Observable<Asset> {
        const copy = this.convert(asset);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<Asset> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
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
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return new ResponseWrapper(res.headers, result, res.status);
    }

    /**
     * Convert a returned JSON object to Asset.
     */
    private convertItemFromServer(json: any): Asset {
        const entity: Asset = Object.assign(new Asset(), json);
        return entity;
    }

    /**
     * Convert a Asset to a JSON which can be sent to the server.
     */
    private convert(asset: Asset): Asset {
        const copy: Asset = Object.assign({}, asset);
        return copy;
    }
}
