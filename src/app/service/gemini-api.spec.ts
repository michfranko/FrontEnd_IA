import { TestBed } from '@angular/core/testing';

import { GeminiAPI } from './gemini-api';

describe('GeminiAPI', () => {
  let service: GeminiAPI;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeminiAPI);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
