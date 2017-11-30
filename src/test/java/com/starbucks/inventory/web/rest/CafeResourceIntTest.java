package com.starbucks.inventory.web.rest;

import com.starbucks.inventory.StarbucksApp;

import com.starbucks.inventory.domain.Cafe;
import com.starbucks.inventory.repository.CafeRepository;
import com.starbucks.inventory.service.CafeService;
import com.starbucks.inventory.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.List;

import static com.starbucks.inventory.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the CafeResource REST controller.
 *
 * @see CafeResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = StarbucksApp.class)
public class CafeResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    @Autowired
    private CafeRepository cafeRepository;

    @Autowired
    private CafeService cafeService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restCafeMockMvc;

    private Cafe cafe;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final CafeResource cafeResource = new CafeResource(cafeService);
        this.restCafeMockMvc = MockMvcBuilders.standaloneSetup(cafeResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Cafe createEntity(EntityManager em) {
        Cafe cafe = new Cafe()
            .name(DEFAULT_NAME);
        return cafe;
    }

    @Before
    public void initTest() {
        cafe = createEntity(em);
    }

    @Test
    @Transactional
    public void createCafe() throws Exception {
        int databaseSizeBeforeCreate = cafeRepository.findAll().size();

        // Create the Cafe
        restCafeMockMvc.perform(post("/api/cafes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(cafe)))
            .andExpect(status().isCreated());

        // Validate the Cafe in the database
        List<Cafe> cafeList = cafeRepository.findAll();
        assertThat(cafeList).hasSize(databaseSizeBeforeCreate + 1);
        Cafe testCafe = cafeList.get(cafeList.size() - 1);
        assertThat(testCafe.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    public void createCafeWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = cafeRepository.findAll().size();

        // Create the Cafe with an existing ID
        cafe.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCafeMockMvc.perform(post("/api/cafes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(cafe)))
            .andExpect(status().isBadRequest());

        // Validate the Cafe in the database
        List<Cafe> cafeList = cafeRepository.findAll();
        assertThat(cafeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = cafeRepository.findAll().size();
        // set the field null
        cafe.setName(null);

        // Create the Cafe, which fails.

        restCafeMockMvc.perform(post("/api/cafes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(cafe)))
            .andExpect(status().isBadRequest());

        List<Cafe> cafeList = cafeRepository.findAll();
        assertThat(cafeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllCafes() throws Exception {
        // Initialize the database
        cafeRepository.saveAndFlush(cafe);

        // Get all the cafeList
        restCafeMockMvc.perform(get("/api/cafes?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(cafe.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())));
    }

    @Test
    @Transactional
    public void getCafe() throws Exception {
        // Initialize the database
        cafeRepository.saveAndFlush(cafe);

        // Get the cafe
        restCafeMockMvc.perform(get("/api/cafes/{id}", cafe.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(cafe.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingCafe() throws Exception {
        // Get the cafe
        restCafeMockMvc.perform(get("/api/cafes/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCafe() throws Exception {
        // Initialize the database
        cafeService.save(cafe);

        int databaseSizeBeforeUpdate = cafeRepository.findAll().size();

        // Update the cafe
        Cafe updatedCafe = cafeRepository.findOne(cafe.getId());
        // Disconnect from session so that the updates on updatedCafe are not directly saved in db
        em.detach(updatedCafe);
        updatedCafe
            .name(UPDATED_NAME);

        restCafeMockMvc.perform(put("/api/cafes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedCafe)))
            .andExpect(status().isOk());

        // Validate the Cafe in the database
        List<Cafe> cafeList = cafeRepository.findAll();
        assertThat(cafeList).hasSize(databaseSizeBeforeUpdate);
        Cafe testCafe = cafeList.get(cafeList.size() - 1);
        assertThat(testCafe.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    public void updateNonExistingCafe() throws Exception {
        int databaseSizeBeforeUpdate = cafeRepository.findAll().size();

        // Create the Cafe

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restCafeMockMvc.perform(put("/api/cafes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(cafe)))
            .andExpect(status().isCreated());

        // Validate the Cafe in the database
        List<Cafe> cafeList = cafeRepository.findAll();
        assertThat(cafeList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteCafe() throws Exception {
        // Initialize the database
        cafeService.save(cafe);

        int databaseSizeBeforeDelete = cafeRepository.findAll().size();

        // Get the cafe
        restCafeMockMvc.perform(delete("/api/cafes/{id}", cafe.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Cafe> cafeList = cafeRepository.findAll();
        assertThat(cafeList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Cafe.class);
        Cafe cafe1 = new Cafe();
        cafe1.setId(1L);
        Cafe cafe2 = new Cafe();
        cafe2.setId(cafe1.getId());
        assertThat(cafe1).isEqualTo(cafe2);
        cafe2.setId(2L);
        assertThat(cafe1).isNotEqualTo(cafe2);
        cafe1.setId(null);
        assertThat(cafe1).isNotEqualTo(cafe2);
    }
}
