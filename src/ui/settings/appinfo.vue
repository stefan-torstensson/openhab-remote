<template>
    <page>
        <div class="text">
            <h1>OpenHAB Remote</h1>
            <p>
                An unofficial client for the OpenHAB REST API. Built with Vue.js
            </p>
            <p>&copy; {{copyrightYears}}<br>{{author}}</p>
            <p class="text">
                This application is not endorsed by or affiliated with OpenHAB or the OpenHAB foundation.
            </p>
        </div>
        <hr>
        <div class="text-small">
            <h2>Used libraries</h2>
            <library-info></library-info>
        </div>
    </page>
</template>

<script lang="ts">
    import Vue from "vue";
    import {Component} from "vue-property-decorator";
    import Page from "@app/ui/components/page.vue";
    import LibraryInfo from "./library-info.vue";
    import pkg from "@app/../package.json";

    @Component({components: {Page, LibraryInfo}})
    export default class AppInfo extends Vue {

        get copyrightYears(): string {
            return [...new Set([2019, new Date().getFullYear()])].join("-");
        }

        get author(): string {
            return pkg.author;
        }
    }
</script>
