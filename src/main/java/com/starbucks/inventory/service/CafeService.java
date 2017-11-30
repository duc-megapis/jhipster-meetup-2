package com.starbucks.inventory.service;

import com.starbucks.inventory.domain.Cafe;
import com.starbucks.inventory.repository.CafeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


/**
 * Service Implementation for managing Cafe.
 */
@Service
@Transactional
public class CafeService {

    private final Logger log = LoggerFactory.getLogger(CafeService.class);

    private final CafeRepository cafeRepository;

    public CafeService(CafeRepository cafeRepository) {
        this.cafeRepository = cafeRepository;
    }

    /**
     * Save a cafe.
     *
     * @param cafe the entity to save
     * @return the persisted entity
     */
    public Cafe save(Cafe cafe) {
        log.debug("Request to save Cafe : {}", cafe);
        return cafeRepository.save(cafe);
    }

    /**
     * Get all the cafes.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<Cafe> findAll(Pageable pageable) {
        log.debug("Request to get all Cafes");
        return cafeRepository.findAll(pageable);
    }

    /**
     * Get one cafe by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public Cafe findOne(Long id) {
        log.debug("Request to get Cafe : {}", id);
        return cafeRepository.findOne(id);
    }

    /**
     * Delete the cafe by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete Cafe : {}", id);
        cafeRepository.delete(id);
    }
}
