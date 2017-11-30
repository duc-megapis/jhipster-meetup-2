package com.starbucks.inventory.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.starbucks.inventory.domain.Cafe;
import com.starbucks.inventory.service.CafeService;
import com.starbucks.inventory.web.rest.errors.BadRequestAlertException;
import com.starbucks.inventory.web.rest.util.HeaderUtil;
import com.starbucks.inventory.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Cafe.
 */
@RestController
@RequestMapping("/api")
public class CafeResource {

    private final Logger log = LoggerFactory.getLogger(CafeResource.class);

    private static final String ENTITY_NAME = "cafe";

    private final CafeService cafeService;

    public CafeResource(CafeService cafeService) {
        this.cafeService = cafeService;
    }

    /**
     * POST  /cafes : Create a new cafe.
     *
     * @param cafe the cafe to create
     * @return the ResponseEntity with status 201 (Created) and with body the new cafe, or with status 400 (Bad Request) if the cafe has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/cafes")
    @Timed
    public ResponseEntity<Cafe> createCafe(@Valid @RequestBody Cafe cafe) throws URISyntaxException {
        log.debug("REST request to save Cafe : {}", cafe);
        if (cafe.getId() != null) {
            throw new BadRequestAlertException("A new cafe cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Cafe result = cafeService.save(cafe);
        return ResponseEntity.created(new URI("/api/cafes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /cafes : Updates an existing cafe.
     *
     * @param cafe the cafe to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated cafe,
     * or with status 400 (Bad Request) if the cafe is not valid,
     * or with status 500 (Internal Server Error) if the cafe couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/cafes")
    @Timed
    public ResponseEntity<Cafe> updateCafe(@Valid @RequestBody Cafe cafe) throws URISyntaxException {
        log.debug("REST request to update Cafe : {}", cafe);
        if (cafe.getId() == null) {
            return createCafe(cafe);
        }
        Cafe result = cafeService.save(cafe);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, cafe.getId().toString()))
            .body(result);
    }

    /**
     * GET  /cafes : get all the cafes.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of cafes in body
     */
    @GetMapping("/cafes")
    @Timed
    public ResponseEntity<List<Cafe>> getAllCafes(Pageable pageable) {
        log.debug("REST request to get a page of Cafes");
        Page<Cafe> page = cafeService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/cafes");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /cafes/:id : get the "id" cafe.
     *
     * @param id the id of the cafe to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the cafe, or with status 404 (Not Found)
     */
    @GetMapping("/cafes/{id}")
    @Timed
    public ResponseEntity<Cafe> getCafe(@PathVariable Long id) {
        log.debug("REST request to get Cafe : {}", id);
        Cafe cafe = cafeService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(cafe));
    }

    /**
     * DELETE  /cafes/:id : delete the "id" cafe.
     *
     * @param id the id of the cafe to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/cafes/{id}")
    @Timed
    public ResponseEntity<Void> deleteCafe(@PathVariable Long id) {
        log.debug("REST request to delete Cafe : {}", id);
        Cafe cafe = cafeService.findOne(id);
        if(cafe == null || !cafe.getUsers().isEmpty()){
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "deletefail", "Delete Failed. Please remove users first")).body(null);
        }
        cafeService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
