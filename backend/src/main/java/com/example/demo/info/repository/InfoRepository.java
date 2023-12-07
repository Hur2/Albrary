package com.example.demo.info.repository;

import com.example.demo.info.entity.InfoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InfoRepository extends JpaRepository<InfoEntity, Long> {
}
