import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorldAnalyticsComponent } from './world-analytics.component';

describe('WorldAnalyticsComponent', () => {
  let component: WorldAnalyticsComponent;
  let fixture: ComponentFixture<WorldAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorldAnalyticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorldAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
