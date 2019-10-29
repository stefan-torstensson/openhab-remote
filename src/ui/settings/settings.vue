<template>
    <div class="fill-available-space">
        <router-view></router-view>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import {Component} from "vue-property-decorator";

@Component()
export default class Settings extends Vue {}

</script>
