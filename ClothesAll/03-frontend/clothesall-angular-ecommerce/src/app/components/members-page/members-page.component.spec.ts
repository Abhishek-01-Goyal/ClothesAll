import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersPAgeComponent } from './members-page.component';

describe('MembersPAgeComponent', () => {
  let component: MembersPAgeComponent;
  let fixture: ComponentFixture<MembersPAgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MembersPAgeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MembersPAgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
