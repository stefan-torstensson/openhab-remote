<template>
    <div class="application-root theme-red">
        <div class="fill-available-space">
            <router-view></router-view>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import {Component} from "vue-property-decorator";

    @Component({})
    export default class Playground extends Vue {}
</script>

