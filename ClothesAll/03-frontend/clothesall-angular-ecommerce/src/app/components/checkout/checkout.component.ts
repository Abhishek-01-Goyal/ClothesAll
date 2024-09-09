import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ClothesAllFormService } from '../../services/clothes-all-form.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { CartService } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { Router } from '@angular/router';
import { Order } from '../../common/order';
import { OrderItem } from '../../common/order-item';
import { Purchase } from '../../common/purchase';
import { ClothesAllValidators } from '../../validators/clothes-all-validators';
import { environment } from '../../../environments/environment';
import { PaymentInfo } from '../../common/payment-info';
import { state } from '@angular/animations';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  storage: Storage = sessionStorage;

  stripe = Stripe(environment.stripePublishableKey);

  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any ="";

  isDisabled: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private ClothesAllFormService: ClothesAllFormService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.setupStripePaymentForm();

    this.reviewCartDetails();

    const theEmail = JSON.parse(this.storage.getItem('userEmail')!);

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          ClothesAllValidators.notOnlyWhitespace,
        ]),
        lastName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          ClothesAllValidators.notOnlyWhitespace,
        ]),
        email: new FormControl(theEmail, [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ]),
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          ClothesAllValidators.notOnlyWhitespace,
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          ClothesAllValidators.notOnlyWhitespace,
        ]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
          ClothesAllValidators.notOnlyWhitespace,
        ]),
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          ClothesAllValidators.notOnlyWhitespace,
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          ClothesAllValidators.notOnlyWhitespace,
        ]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
          ClothesAllValidators.notOnlyWhitespace,
        ]),
      })
    });/*
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          ClothesAllValidators.notOnlyWhitespace,
        ]),
        cardNumber: new FormControl('', [
          Validators.required,
          Validators.pattern('[0-9]{16}$'),
        ]),
        securityCode: new FormControl('', [
          Validators.required,
          Validators.pattern('[0-9]{3}$'),
        ]),
        expirationMonth: [''],
        expirationYear: [''],
      }),
    });

    // Load credit card months and years
    const startMonth: number = new Date().getMonth() + 1;
    this.ClothesAllFormService
      .getCreditCardMonths(startMonth)
      .subscribe(data =>{
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      });

      this.ClothesAllFormService.getCreditCardYears().subscribe(
        data => {
          console.log("Retrieved credit card years: " + JSON.stringify(data));
          this.creditCardYears = data;
        }
      );
      */

      this.ClothesAllFormService.getCountries().subscribe(
        data => {
          console.log("Retrieved countries: " + JSON.stringify(data));
          this.countries = data;
        }
      )
}
  setupStripePaymentForm() {

    var elements = this.stripe.elements();

    this.cardElement = elements.create('card', {hidePostalCode: true});

    this.cardElement.mount('#card-element');

    this.cardElement.on('change', (event: any) => {

      this.displayError = document.getElementById('card-errors');

      if(event.complete){
        this.displayError.textContent = "";

      }else if(event.error){
        this.displayError.textContent = event.error.message;
      }
    });

    }

  reviewCartDetails() {
    this.cartService.totalQuantity.subscribe(
      (totalQuantity) => (this.totalQuantity = totalQuantity)
    );

    this.cartService.totalPrice.subscribe(
      (totalPrice) => (this.totalPrice = totalPrice)
    );
  }

  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }

  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }

  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }

  get shippingAddressStreet() {
    return this.checkoutFormGroup.get('shippingAddress.street');
  }

  get shippingAddressCity() {
    return this.checkoutFormGroup.get('shippingAddress.city');
  }

  get shippingAddressState() {
    return this.checkoutFormGroup.get('shippingAddress.state');
  }

  get shippingAddressZipCode() {
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }

  get shippingAddressCountry() {
    return this.checkoutFormGroup.get('shippingAddress.country');
  }

  get billingAddressStreet() {
    return this.checkoutFormGroup.get('billingAddress.street');
  }

  get billingAddressCity() {
    return this.checkoutFormGroup.get('billingAddress.city');
  }

  get billingAddressState() {
    return this.checkoutFormGroup.get('billingAddress.state');
  }

  get billingAddressZipCode() {
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }

  get billingAddressCountry() {
    return this.checkoutFormGroup.get('billingAddress.country');
  }

  get creditCardType() {
    return this.checkoutFormGroup.get('creditCard.cardType');
  }

  get creditCardNameOnCard() {
    return this.checkoutFormGroup.get('creditCard.nameOnCard');
  }

  get creditCardNumber() {
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }

  get creditCardSecurityCode() {
    return this.checkoutFormGroup.get('creditCard.securityCode');
  }

  copyShippingAddressToBillingAddress(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.checked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(
        this.checkoutFormGroup.controls['shippingAddress'].value
      );
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
    }
  }

  onSubmit() {
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    const cartItems = this.cartService.cartItems;
    /*
    let orderItems: OrderItem[] =[];
    for(let i=0; i < cartItems.length; i++){
      orderItems[i] = new OrderItem(cartItems[i]);
    }
*/

    let orderItems: OrderItem[] = cartItems.map(
      (tempCartItem) => new OrderItem(tempCartItem)
    );

    let purchase = new Purchase();

    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    purchase.shippingAddress =
      this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(
      JSON.stringify(purchase.shippingAddress.state)
    );
    const shippingCountry: Country = JSON.parse(
      JSON.stringify(purchase.shippingAddress.country)
    );
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    purchase.billingAddress =
      this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(
      JSON.stringify(purchase.billingAddress.state)
    );
    const billingCountry: Country = JSON.parse(
      JSON.stringify(purchase.billingAddress.country)
    );
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    purchase.order = order;
    purchase.orderItems = orderItems;

    this.paymentInfo.amount = this.totalPrice * 100;
    this.paymentInfo.currency = "INR";
    this.paymentInfo.receiptEmail = purchase.customer.email;



    if(!this.checkoutFormGroup.invalid && this.displayError.textContent === ""){

      this.isDisabled = true;

      this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe(
        (paymentIntentResponse) => {
          this.stripe.confirmCardPayment(paymentIntentResponse.client_secret,
            {
              payment_method: {
                card: this.cardElement,
                billing_details: {
                  email: purchase.customer.email,
                  name: `${purchase.customer.firstName} ${purchase.customer.lastName}`,
                  address:{
                    line1: purchase.billingAddress.street,
                    city: purchase.billingAddress.city,
                    state: purchase.billingAddress.state,
                    postal_code: purchase.billingAddress.zipCode,
                    country: this.billingAddressCountry?.value.code



                  }
                }
              }
            }, {handleActions: false})
            .then((result: any) => {
              if(result.error){
                alert(`There was an error: ${result.error.message}`);
                this.isDisabled = false;
              }else{
                this.checkoutService.placeOrder(purchase).subscribe({
                  next: (response: any) =>{
                    alert(`Your order has been received.\n Order tracking bumber: ${response.orderTrackingNumber}`);

                    this.resetCart();
                    this.isDisabled = false;
                  },
                  error:(err:any) =>{
                    alert(`There was an error: ${err.message}`);
                    this.isDisabled = false;
                  }
                })
              }
            })

          
        }
      );
    }else{
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

  }
  resetCart() {
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.cartService.persistCartItems();

    this.checkoutFormGroup.reset();

    this.router.navigateByUrl('/products');
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.ClothesAllFormService
      .getCreditCardMonths(startMonth)
      .subscribe(data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      });
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    console.log(`{formGroupName} country code: ${countryCode}`);
    console.log(`{formGroupName} country name: ${countryName}`);

    this.ClothesAllFormService.getStates(countryCode).subscribe(
      data => {
        if(formGroupName === 'shippingAddress'){
          this.shippingAddressStates = data;
        }
        else{
          this,this.billingAddressStates = data;
        }
        formGroup?.get('state')?.setValue(data[0]);
      }
    );


  }
}
