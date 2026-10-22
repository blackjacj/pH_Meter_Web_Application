import { TestBed } from '@angular/core/testing';

import { GraphSettingsService } from './graph-settings.service';

describe('GraphSettingsService', () => {
  let service: GraphSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraphSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
