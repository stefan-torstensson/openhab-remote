<script lang="ts">
    import Vue from "vue";
    import {Component, Prop} from "vue-property-decorator";

    @Component
    export default class SimpleList extends Vue {
        @Prop([Object])
        list: any[];
    }

</script>

<template>
    <div class="simple-list">
        <div v-for="item in list">
            <div class="simple-list__contents">{{item.label}}</div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import '~settings';

    .simple-list {
        width: 100%;
        height: 320px;
        //position:  absolute;
        display: grid;
        margin: 0;
        list-style: none;
        padding: 0 10px;
        //grid-template-rows: 1fr;
        grid-auto-rows: $screen-height/3;
        align-items: center;
        text-align: center;
        li {
            //padding: 20px 5px;
            //height: $screen-height/3;
            vertical-align: bottom;
            border: 1px solid blue;
        }
    }

    .simple-list__contents {
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>
