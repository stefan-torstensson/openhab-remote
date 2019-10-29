<template>
    <page>
        <template v-slot:header>
            <div class="center-text page_heading">
                OpenHAB UI
            </div>
        </template>
        <div class="text">
            <h3>OpenHAB Remote</h3>
            <p>
            An unofficial client for the OpenHAB REST API. Built with Vue.js
            </p>
            <p>
            This application is not endorsed by or affiliated with OpenHAB or the OpenHAB foundation.
            </p>
        </div>
    </page>
</template>

<script lang="ts">
    import Vue from "vue";
    import {Component} from "vue-property-decorator";
    import Page from "@app/ui/components/page.vue";

    @Component({components: {Page}})
    export default class AppInfo extends Vue {
    }
</script>
