<template>
    <page>
        <div class="text">
            <h1>{{appName}}</h1>
            <p>{{version}} - ({{buildType}})</p>
            <p>
                An unofficial client for the openHAB REST API. Built with Vue.js
            </p>
            <p>&copy; {{copyrightYears}}<br>{{author}}</p>
            <p class="text">
                This application is not endorsed by or affiliated with openHAB or the openHAB foundation.
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
    import pkg from "package.json";

    declare var COPYRIGHT_YEARS: string;
    declare var PRODUCTION_BUILD: boolean;

    @Component({components: {Page, LibraryInfo}})
    export default class AppInfo extends Vue {

        get appName(): string {
            return pkg.tizen.appName;
        }

        get version(): string {
            return pkg.version;
        }

        get author(): string {
            return pkg.author;
        }

        get buildType(): string {
            return PRODUCTION_BUILD ? "release" : "debug";
        }

        get copyrightYears(): string {
            return COPYRIGHT_YEARS;
        }
    }
</script>
