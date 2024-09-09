import { Component, OnInit } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  product: Product = new Product(
    '', // id
    '', // name
    '', // description
    '', // unitPrice
    0, // imageUrl
    '', // active
    true, // unitsInStock
    1, // dateCreated
    new Date(), // lastUpdated
    new Date() // categoryId
  );

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    });
  }

  handleProductDetails() {
    const theProductId = this.route.snapshot.paramMap.get('id');

    if (theProductId !== null) {
      const productIdNumber = +theProductId;

      this.productService.getProduct(productIdNumber).subscribe((data) => {
        this.product = data;
      });
    }
  }

  addToCart() {
    console.log(
      `Adding to cart: ${this.product.name}, ${this.product.unitPrice}`
    );
    const theCartItem = new CartItem(this.product);
    this.cartService.addToCart(theCartItem);
  }
}
