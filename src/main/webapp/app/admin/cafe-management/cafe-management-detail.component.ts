import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { Cafe } from './cafe.model';
import { CafeService } from './cafe.service';

@Component({
    selector: 'jhi-cafe-mgmt-detail',
    templateUrl: './cafe-management-detail.component.html'
})
export class CafeMgmtDetailComponent implements OnInit, OnDestroy {

    cafe: Cafe;
    private subscription: Subscription;

    constructor(
        private cafeService: CafeService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
    }

    load(id) {
        this.cafeService.find(id).subscribe((cafe) => {
            this.cafe = cafe;
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
