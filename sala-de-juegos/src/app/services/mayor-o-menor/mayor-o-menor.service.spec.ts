import { TestBed } from '@angular/core/testing';

import { MayorOMenorService } from './mayor-o-menor.service';

describe('MayorOMenorService', () => {
  let service: MayorOMenorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MayorOMenorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
