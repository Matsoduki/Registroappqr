import { TestBed } from '@angular/core/testing';

import { DatabaseInitializerService } from './database-initializer.service';

describe('DatabaseInitializerService', () => {
  let service: DatabaseInitializerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatabaseInitializerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
