package com.starbucks.inventory.repository;

import com.starbucks.inventory.domain.Cafe;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the Cafe entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CafeRepository extends JpaRepository<Cafe, Long> {

}
