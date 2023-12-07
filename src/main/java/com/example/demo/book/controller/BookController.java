package com.example.demo.book.controller;

import com.example.demo.book.dto.BookDTO;
import com.example.demo.book.dto.BookSimpleDTO;
import com.example.demo.book.entity.BookEntity;
import com.example.demo.book.repository.BookRepository;
import com.example.demo.page.dto.PageDTO;
import com.example.demo.page.entity.PageEntity;
import com.itextpdf.kernel.geom.PageSize;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.itextpdf.io.image.ImageData;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Image;

import java.io.ByteArrayOutputStream;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/books")
@CrossOrigin(origins = "http://13.124.203.82")
public class BookController {
    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private HttpSession session;

    @PostMapping
    @CrossOrigin(origins = "http://13.124.203.82")
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
    @CrossOrigin(origins = "http://13.124.203.82")
    public List<BookEntity> getAllBooks(){
        return bookRepository.findAll();
    }

    //나만의 책장에서 책 들어가기
    @GetMapping("myBooks/{bookId}")
    @CrossOrigin(origins = "http://13.124.203.82")
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

   //모두의 책장에서 책 들어가기
    @GetMapping("/{bookId}")
    @CrossOrigin(origins = "http://13.124.203.82")
    public ResponseEntity<BookDTO> getBookFromAllBooks(@PathVariable Long bookId) {
        BookEntity bookEntity = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "책을 찾을 수 없습니다."));

        // 조회수 증가
        bookEntity.setViewCount(bookEntity.getViewCount() + 1);
        bookRepository.save(bookEntity);

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
    @CrossOrigin(origins = "http://13.124.203.82")
    public ResponseEntity<?> getBooks() {
        List<BookEntity> bookEntities = bookRepository.findAll(Sort.by(Sort.Direction.DESC, "viewCount"));
        List<BookSimpleDTO> bookDTOs = bookEntities.stream().map(book ->
                new BookSimpleDTO(book.getId(), book.getCover_image(), book.getTitle(), book.getAuthor()) // 생성자를 사용하여 객체 생성
        ).collect(Collectors.toList());

        return ResponseEntity.ok(Collections.singletonMap("mineBook", bookDTOs));
    }

    // 나만의 책장 리스트
    @GetMapping("/mine_book_list")
    @CrossOrigin(origins = "http://13.124.203.82")
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

    //책 삭제
    @DeleteMapping("delete/{bookId}")
    @CrossOrigin(origins = "http://13.124.203.82")
    public ResponseEntity<?> deleteBook(@PathVariable Long bookId, HttpServletRequest request) {
        // 현재 세션에서 userId 가져오기
        Long userId = (Long) request.getSession().getAttribute("userId");
        if (userId == null) {
            // 사용자가 로그인하지 않은 경우
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("message", "로그인이 필요합니다."));
        }

        // 책이 존재하는지 확인
        BookEntity bookEntity = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "삭제할 책을 찾을 수 없습니다."));

        // 책의 소유자가 현재 로그인한 사용자인지 확인
        if (!bookEntity.getUserId().equals(userId)) {
            // 책의 소유자가 아닌 경우 삭제 거부
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Collections.singletonMap("message", "삭제 권한이 없습니다."));
        }

        // 책 삭제
        bookRepository.delete(bookEntity);

        // 성공적으로 삭제되었음을 알리는 응답 반환
        return ResponseEntity.ok(Collections.singletonMap("message", "책이 성공적으로 삭제되었습니다."));
    }

    /*
    @DeleteMapping("delete/{bookId}")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<?> deleteBook(@PathVariable Long bookId) {
        // 먼저 책이 존재하는지 확인
        BookEntity bookEntity = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "삭제할 책을 찾을 수 없습니다."));

        // 책 삭제
        bookRepository.delete(bookEntity);

        // 삭제 ok
        return ResponseEntity.ok(Collections.singletonMap("message", "책이 성공적으로 삭제되었습니다."));
    }

     */


    //pdf로, 바로 다운로드
    @GetMapping("/{bookId}/pdf")
    @CrossOrigin(origins = "http://13.124.203.82")
    public ResponseEntity<byte[]> getBookAsPdf(@PathVariable Long bookId) {
        BookEntity bookEntity = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "책을 찾을 수 없습니다."));

        List<String> base64Images = bookEntity.getPages().stream()
                .map(page -> Base64.getEncoder().encodeToString(page.getContent_data()))
                .collect(Collectors.toList());

        byte[] pdfContent = createPdfFromImages(base64Images);

        // 책 제목.pdf
        String safeFileName = bookEntity.getTitle().replaceAll("[^a-zA-Z0-9\\-_ ]", "") + ".pdf";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.attachment().filename(safeFileName).build());


        return new ResponseEntity<>(pdfContent, headers, HttpStatus.OK);
    }

    private byte[] createPdfFromImages(List<String> base64Images) {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(outputStream);

            PageSize pageSize = new PageSize(PageSize.A4.getHeight(), PageSize.A5.getWidth());
            PdfDocument pdf = new PdfDocument(writer);
            pdf.setDefaultPageSize(pageSize);

            Document document = new Document(pdf);
            document.setMargins(0, 0, 0, 0);

            for (String base64Image : base64Images) {
                byte[] imageBytes = Base64.getDecoder().decode(base64Image);
                ImageData imageData = ImageDataFactory.create(imageBytes);
                Image image = new Image(imageData);
                document.add(image);
            }

            document.close();
            return outputStream.toByteArray();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }





}
