import { TestBed } from '@angular/core/testing';

import { HeroGuardServiceService } from './hero-guard-service.service';

describe('HeroGuardServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HeroGuardServiceService = TestBed.get(HeroGuardServiceService);
    expect(service).toBeTruthy();
  });
});
