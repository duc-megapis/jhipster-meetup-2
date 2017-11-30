import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';

import { Asset } from './asset.model';
import { AssetService } from './asset.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-asset',
    templateUrl: './asset.component.html'
})
export class AssetComponent implements OnInit, OnDestroy {
assets: Asset[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private assetService: AssetService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.assetService.query().subscribe(
            (res: ResponseWrapper) => {
                this.assets = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInAssets();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Asset) {
        return item.id;
    }
    registerChangeInAssets() {
        this.eventSubscriber = this.eventManager.subscribe('assetListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
