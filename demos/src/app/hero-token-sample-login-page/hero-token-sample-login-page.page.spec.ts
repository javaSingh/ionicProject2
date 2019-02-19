import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroTokenSampleLoginPagePage } from './hero-token-sample-login-page.page';

describe('HeroTokenSampleLoginPagePage', () => {
  let component: HeroTokenSampleLoginPagePage;
  let fixture: ComponentFixture<HeroTokenSampleLoginPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeroTokenSampleLoginPagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroTokenSampleLoginPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
