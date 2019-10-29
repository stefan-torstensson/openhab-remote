<template>
    <li class="scaling-list_item"><slot></slot></li>
</template>

<style lang="scss" scoped>
    .scaling-list_item > *{
        position: relative;
        top: 50%;
        transform: translateY(-50%);
        height: 100%;
        width: 100%;
    }
</style>
