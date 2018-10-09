import { TestBed } from '@angular/core/testing';

import { NetatmoService } from './netatmo.service';

describe('NetatmoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NetatmoService = TestBed.get(NetatmoService);
    expect(service).toBeTruthy();
  });
});
