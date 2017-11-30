import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Cafe } from './cafe.model';
import { CafeModalService } from './cafe-modal.service';
import { CafeService } from './cafe.service';

@Component({
    selector: 'jhi-cafe-mgmt-delete-dialog',
    templateUrl: './cafe-management-delete-dialog.component.html'
})
export class CafeMgmtDeleteDialogComponent {

    cafe: Cafe;

    constructor(
        private cafeService: CafeService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.cafeService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({ name: 'cafeListModification',
                content: 'Deleted a cafe'});
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-cafe-delete-dialog',
    template: ''
})
export class CafeDeleteDialogComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private cafeModalService: CafeModalService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.cafeModalService.open(CafeMgmtDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
