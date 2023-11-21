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

class GetBooksEndpoint {
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
    public void testGetBooksEndpoint() throws Exception {
        // Given
        List<BookEntity> bookList = Arrays.asList(new BookEntity(), new BookEntity());
        when(bookRepository.findAll()).thenReturn(bookList);

        // When & Then
        mockMvc.perform(get("/books/book_list"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.mineBook.size()").value(bookList.size()));
    }
}
