import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { StarbucksSharedModule } from '../../shared';
import {
    AssetService,
    AssetPopupService,
    AssetComponent,
    AssetDetailComponent,
    AssetDialogComponent,
    AssetPopupComponent,
    AssetDeletePopupComponent,
    AssetDeleteDialogComponent,
    assetRoute,
    assetPopupRoute,
} from './';

const ENTITY_STATES = [
    ...assetRoute,
    ...assetPopupRoute,
];

@NgModule({
    imports: [
        StarbucksSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        AssetComponent,
        AssetDetailComponent,
        AssetDialogComponent,
        AssetDeleteDialogComponent,
        AssetPopupComponent,
        AssetDeletePopupComponent,
    ],
    entryComponents: [
        AssetComponent,
        AssetDialogComponent,
        AssetPopupComponent,
        AssetDeleteDialogComponent,
        AssetDeletePopupComponent,
    ],
    providers: [
        AssetService,
        AssetPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StarbucksAssetModule {}
