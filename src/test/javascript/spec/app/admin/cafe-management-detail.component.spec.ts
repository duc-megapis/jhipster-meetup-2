/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { StarbucksTestModule } from '../../test.module';
import { MockActivatedRoute } from '../../helpers/mock-route.service';
import { CafeMgmtDetailComponent } from '../../../../../main/webapp/app/admin/cafe-management/cafe-management-detail.component';
import { CafeService } from '../../../../../main/webapp/app/admin/cafe-management/cafe.service';
import { Cafe } from '../../../../../main/webapp/app/admin/cafe-management/cafe.model';

describe('Component Tests', () => {

    describe('Cafe Management Detail Component', () => {
        let comp: CafeMgmtDetailComponent;
        let fixture: ComponentFixture<CafeMgmtDetailComponent>;
        let service: CafeService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [StarbucksTestModule],
                declarations: [CafeMgmtDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    CafeService,
                    JhiEventManager
                ]
            }).overrideTemplate(CafeMgmtDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CafeMgmtDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CafeService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new Cafe(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.cafe).toEqual(jasmine.objectContaining({id: 10}));
            });
        });
    });

});
