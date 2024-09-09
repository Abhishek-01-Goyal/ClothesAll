package com.clothesall.ecommerce.dao;

import com.clothesall.ecommerce.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer,Long> {

    Customer findByEmail(String theEmail);

}
