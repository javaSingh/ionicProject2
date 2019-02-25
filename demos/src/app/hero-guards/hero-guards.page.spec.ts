import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroGuardsPage } from './hero-guards.page';

describe('HeroGuardsPage', () => {
  let component: HeroGuardsPage;
  let fixture: ComponentFixture<HeroGuardsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeroGuardsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroGuardsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
