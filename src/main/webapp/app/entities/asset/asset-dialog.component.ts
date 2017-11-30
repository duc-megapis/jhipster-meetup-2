import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Cafe } from '../../admin/cafe-management/cafe.model';
import { CafeService } from '../../admin/cafe-management/cafe.service';
import { ResponseWrapper, Principal} from '../../shared';
import { Observable } from 'rxjs/Rx';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Asset } from './asset.model';
import { AssetPopupService } from './asset-popup.service';
import { AssetService } from './asset.service';

@Component({
    selector: 'jhi-asset-dialog',
    templateUrl: './asset-dialog.component.html'
})
export class AssetDialogComponent implements OnInit {

    asset: Asset;
    cafes: Cafe[];
    currentAccount: any;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private assetService: AssetService,
        private eventManager: JhiEventManager,
        private cafeService: CafeService,
        private principal: Principal
        ) {
            this.principal.identity().then((account) => {
                this.currentAccount = account;
            });
        }

    ngOnInit() {
        this.cafeService.query()
            .subscribe((res: ResponseWrapper) => { this.cafes = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
        this.isSaving = false;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.currentAccount.cafe) {
            this.asset.cafe = this.currentAccount.cafe;
        }
        if (this.asset.id !== undefined) {
            this.subscribeToSaveResponse(
                this.assetService.update(this.asset));
        } else {
            this.subscribeToSaveResponse(
                this.assetService.create(this.asset));
        }
    }

    private subscribeToSaveResponse(result: Observable<Asset>) {
        result.subscribe((res: Asset) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: Asset) {
        this.eventManager.broadcast({ name: 'assetListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    trackCafeById(index: number, item: Cafe) {
        return item.id;
    }
    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }
}

@Component({
    selector: 'jhi-asset-popup',
    template: ''
})
export class AssetPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private assetPopupService: AssetPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.assetPopupService
                    .open(AssetDialogComponent as Component, params['id']);
            } else {
                this.assetPopupService
                    .open(AssetDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
