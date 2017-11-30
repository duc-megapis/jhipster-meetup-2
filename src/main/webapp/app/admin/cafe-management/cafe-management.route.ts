import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { CafeMgmtComponent } from './cafe-management.component';
import { CafeMgmtDetailComponent } from './cafe-management-detail.component';
import { CafeDialogComponent } from './cafe-management-dialog.component';
import { CafeDeleteDialogComponent } from './cafe-management-delete-dialog.component';
import { CafeRouteAccessService } from './../../shared';

@Injectable()
export class CafeResolvePagingParams implements Resolve<any> {

    constructor(private paginationUtil: JhiPaginationUtil) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const page = route.queryParams['page'] ? route.queryParams['page'] : '1';
        const sort = route.queryParams['sort'] ? route.queryParams['sort'] : 'id,asc';
        return {
            page: this.paginationUtil.parsePage(page),
            predicate: this.paginationUtil.parsePredicate(sort),
            ascending: this.paginationUtil.parseAscending(sort)
        };
    }
}

export const cafeMgmtRoute: Routes = [
    {
        path: 'cafe-management',
        component: CafeMgmtComponent,
        resolve: {
            'pagingParams': CafeResolvePagingParams
        },
        data: {
            pageTitle: 'cafeManagement.home.title'
        },
        canActivate: [CafeRouteAccessService]
    },
    {
        path: 'cafe-management/:id',
        component: CafeMgmtDetailComponent,
        data: {
            pageTitle: 'cafeManagement.home.title'
        },
        canActivate: [CafeRouteAccessService]
    }
];

export const cafeDialogRoute: Routes = [
    {
        path: 'cafe-management-new',
        component: CafeDialogComponent,
        outlet: 'popup',
        canActivate: [CafeRouteAccessService]
    },
    {
        path: 'cafe-management/:id/edit',
        component: CafeDialogComponent,
        outlet: 'popup',
        canActivate: [CafeRouteAccessService]
    },
    {
        path: 'cafe-management/:id/delete',
        component: CafeDeleteDialogComponent,
        outlet: 'popup',
        canActivate: [CafeRouteAccessService]
    }
];
