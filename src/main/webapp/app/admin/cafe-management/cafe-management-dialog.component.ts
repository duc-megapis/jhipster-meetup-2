import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Cafe } from './cafe.model';
import { CafeModalService } from './cafe-modal.service';
import { CafeService } from './cafe.service';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-cafe-mgmt-dialog',
    templateUrl: './cafe-management-dialog.component.html'
})
export class CafeMgmtDialogComponent implements OnInit {

    cafe: Cafe;
    isSaving: boolean;
    isEditing: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private cafeService: CafeService,
        private eventManager: JhiEventManager
    ) {}

    ngOnInit() {
        this.isSaving = false;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.cafe.id !== undefined) {
            this.subscribeToSaveResponse(
                this.cafeService.update(this.cafe));
        } else {
            this.subscribeToSaveResponse(this.cafeService.create(this.cafe));
        }
    }

    private subscribeToSaveResponse(result: Observable<Cafe>) {
        result.subscribe((res: Cafe) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: Cafe) {
        this.eventManager.broadcast({ name: 'cafeListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError(error) {
        try {
            error.json();
        } catch (exception) {
            error.message = error.text();
        }
        this.isSaving = false;
        this.onError(error);
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
}

@Component({
    selector: 'jhi-cafe-dialog',
    template: ''
})
export class CafeDialogComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private cafeModalService: CafeModalService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.cafeModalService
                    .open(CafeMgmtDialogComponent as Component, params['id']);
            } else {
                this.cafeModalService
                    .open(CafeMgmtDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
