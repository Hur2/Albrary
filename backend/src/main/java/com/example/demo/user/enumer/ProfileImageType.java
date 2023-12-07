package com.example.demo.user.enumer;

public enum ProfileImageType {
    TYPE_0(0),
    TYPE_1(1),
    TYPE_2(2),
    TYPE_3(3),
    TYPE_4(4);

    private final int value;

    ProfileImageType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}
