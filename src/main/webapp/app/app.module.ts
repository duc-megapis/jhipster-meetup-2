import './vendor.ts';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Ng2Webstorage } from 'ng2-webstorage';

import { StarbucksSharedModule, UserRouteAccessService, CafeRouteAccessService } from './shared';
import { StarbucksAppRoutingModule} from './app-routing.module';
import { StarbucksHomeModule } from './home/home.module';
import { StarbucksAdminModule } from './admin/admin.module';
import { StarbucksAccountModule } from './account/account.module';
import { StarbucksEntityModule } from './entities/entity.module';
import { customHttpProvider } from './blocks/interceptor/http.provider';
import { PaginationConfig } from './blocks/config/uib-pagination.config';

// jhipster-needle-angular-add-module-import JHipster will add new module here

import {
    JhiMainComponent,
    NavbarComponent,
    FooterComponent,
    ProfileService,
    PageRibbonComponent,
    ActiveMenuDirective,
    ErrorComponent
} from './layouts';

@NgModule({
    imports: [
        BrowserModule,
        StarbucksAppRoutingModule,
        Ng2Webstorage.forRoot({ prefix: 'jhi', separator: '-'}),
        StarbucksSharedModule,
        StarbucksHomeModule,
        StarbucksAdminModule,
        StarbucksAccountModule,
        StarbucksEntityModule,
        // jhipster-needle-angular-add-module JHipster will add new module here
    ],
    declarations: [
        JhiMainComponent,
        NavbarComponent,
        ErrorComponent,
        PageRibbonComponent,
        ActiveMenuDirective,
        FooterComponent
    ],
    providers: [
        ProfileService,
        CafeRouteAccessService,
        customHttpProvider(),
        PaginationConfig,
        UserRouteAccessService
    ],
    bootstrap: [ JhiMainComponent ]
})
export class StarbucksAppModule {}
