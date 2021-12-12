import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeseriesanalysisComponent } from './timeseriesanalysis.component';

describe('TimeseriesanalysisComponent', () => {
  let component: TimeseriesanalysisComponent;
  let fixture: ComponentFixture<TimeseriesanalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeseriesanalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeseriesanalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
