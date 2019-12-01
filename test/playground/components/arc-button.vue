<template>
    <div class="fill-available-space">

    <arc-button position="top">Save</arc-button>
    <arc-button position="bottom">Save</arc-button>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import {Component} from "vue-property-decorator";
    import {ArcButton} from "@app/ui/components";

    @Component({components: {ArcButton}})
    export default class ArcButtonSample extends Vue {}
</script>
