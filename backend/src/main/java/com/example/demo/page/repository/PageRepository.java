package com.example.demo.page.repository;

import com.example.demo.page.entity.PageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PageRepository extends JpaRepository<PageEntity, Long> {
    List<PageEntity> findByBookId(Long bookId);
}
