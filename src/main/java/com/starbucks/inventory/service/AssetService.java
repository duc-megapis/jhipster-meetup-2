package com.starbucks.inventory.service;

import com.starbucks.inventory.domain.Asset;
import com.starbucks.inventory.repository.AssetRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service Implementation for managing Asset.
 */
@Service
@Transactional
public class AssetService {

    private final Logger log = LoggerFactory.getLogger(AssetService.class);

    private final AssetRepository assetRepository;

    public AssetService(AssetRepository assetRepository) {
        this.assetRepository = assetRepository;
    }

    /**
     * Save a asset.
     *
     * @param asset the entity to save
     * @return the persisted entity
     */
    public Asset save(Asset asset) {
        log.debug("Request to save Asset : {}", asset);
        return assetRepository.save(asset);
    }

    /**
     * Get all the assets.
     *
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public List<Asset> findAll() {
        log.debug("Request to get all Assets");
        return assetRepository.findAll();
    }

    /**
     * Get one asset by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public Asset findOne(Long id) {
        log.debug("Request to get Asset : {}", id);
        return assetRepository.findOne(id);
    }

    /**
     * Delete the asset by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete Asset : {}", id);
        assetRepository.delete(id);
    }
}
