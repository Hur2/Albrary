package com.example.demo.book.controller;

import com.example.demo.book.dto.BookDTO;
import com.example.demo.book.dto.BookSimpleDTO;
import com.example.demo.book.entity.BookEntity;
import com.example.demo.book.repository.BookRepository;
import com.example.demo.page.dto.PageDTO;
import com.example.demo.page.entity.PageEntity;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/books")
public class BookController {
    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private HttpSession session;

    @PostMapping
    public BookEntity createBook(@RequestBody BookEntity book){
        // 세션에서 사용자 ID를 가져옵니다.
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            // 사용자가 로그인하지 않은 경우 에러 처리
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "사용자가 로그인하지 않았습니다.");
        }
        // 책에 사용자 ID를 설정합니다.
        book.setUserId(userId);

        for(PageEntity page : book.getPages()){
            page.setBook(book);
        }
        return bookRepository.save(book);
    }

    @GetMapping
    public List<BookEntity> getAllBooks(){
        return bookRepository.findAll();
    }

    @GetMapping("/{bookId}")
    public ResponseEntity<BookDTO> getBook(@PathVariable Long bookId) {
        BookEntity bookEntity = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "책을 찾을 수 없습니다."));

        BookDTO bookDTO = new BookDTO(
                bookEntity.getId(),
                bookEntity.getCover_image(),
                bookEntity.getTitle(),
                bookEntity.getAuthor(),
                bookEntity.getPages().stream()
                        .map(page -> new PageDTO(page.getId(), page.getContent_data()))
                        .collect(Collectors.toList())
        );

        return ResponseEntity.ok(bookDTO);
    }

    @Autowired
    public BookController(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }


    // 모두의 책장 리스트
    @GetMapping("/book_list")
    public ResponseEntity<?> getBooks() {
        List<BookEntity> bookEntities = bookRepository.findAll();
        List<BookSimpleDTO> bookDTOs = bookEntities.stream().map(book ->
                new BookSimpleDTO(book.getId(), book.getCover_image(), book.getTitle(), book.getAuthor()) // 생성자를 사용하여 객체 생성
        ).collect(Collectors.toList());

        // "mineBook" 키로 감싸서 JSON으로 반환합니다.
        return ResponseEntity.ok(Collections.singletonMap("mineBook", bookDTOs));
    }

    // 나만의 책장 리스트
    @GetMapping("/mine_book_list")
    public ResponseEntity<Map<String, Object>> getMyBooks() {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            // 사용자가 로그인하지 않았을 경우 에러 응답
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("error", "사용자가 로그인하지 않았습니다."));
        }

        List<BookEntity> userBookEntities = bookRepository.findByUserId(userId);
        List<BookSimpleDTO> userBookDTOs = userBookEntities.stream().map(book ->
                new BookSimpleDTO(book.getId(), book.getCover_image(), book.getTitle(), book.getAuthor())
        ).collect(Collectors.toList());

        return ResponseEntity.ok(Collections.singletonMap("mineBook", userBookDTOs));
    }


}
