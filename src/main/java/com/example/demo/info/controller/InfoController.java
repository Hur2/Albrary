package com.example.demo.info.controller;

import aj.org.objectweb.asm.TypeReference;
import com.example.demo.info.dto.InfoDTO;
import com.example.demo.info.entity.InfoEntity;
import com.example.demo.info.repository.InfoRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/info")
public class InfoController {
    @Autowired
    private InfoRepository infoRepository;

    @PostMapping("/add")
    public ResponseEntity<String> addInfos(@RequestBody List<InfoDTO> qaPairs) {
        try {
            // DTO를 엔티티로 변환하여 저장
            List<InfoEntity> qaPairEntities = qaPairs.stream()
                    .map(dto -> new InfoEntity(dto.getQuestion(), dto.getAnswer()))
                    .collect(Collectors.toList());

            infoRepository.saveAll(qaPairEntities);
            return new ResponseEntity<>("Q&A pairs saved successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error saving Q&A pairs", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}