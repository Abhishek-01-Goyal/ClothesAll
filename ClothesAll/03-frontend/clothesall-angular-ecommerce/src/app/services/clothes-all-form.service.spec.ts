import { TestBed } from '@angular/core/testing';

import { ClothesAllFormService } from './clothes-all-form.service';

describe('ClothesAllFormService', () => {
  let service: ClothesAllFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClothesAllFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
