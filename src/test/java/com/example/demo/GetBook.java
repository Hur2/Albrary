package com.example.demo;

import static org.mockito.Mockito.*;
import static org.mockito.BDDMockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.*;

import com.example.demo.book.controller.BookController;
import com.example.demo.book.entity.BookEntity;
import com.example.demo.book.repository.BookRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.Arrays;
import java.util.List;
class GetBook {
    private MockMvc mockMvc;

    @Mock
    private BookRepository bookRepository;

    @InjectMocks // auto inject bookRepository
    private BookController bookController;

    // This setup needs to be run before the tests, it will set up the MockMvc object with the BookController.
    @BeforeEach
    public void setup(WebApplicationContext context) {
        mockMvc = MockMvcBuilders
                .standaloneSetup(bookController)
                .build();
    }

    @Test
    public void testGetBook() throws Exception {
        // Given
        long bookId = 1L;
        BookEntity bookEntity = new BookEntity();
        bookEntity.setId(bookId);
        given(bookRepository.findById(bookId)).willReturn(java.util.Optional.of(bookEntity));

        // When & Then
        mockMvc.perform(get("/books/{bookId}", bookId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(bookId));
    }
}
