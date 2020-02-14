<template>
    <div>Wizard</div>
</template>
<script lang="ts">
    import Vue from "vue";
    import {Component} from "vue-property-decorator";
    import {Inject} from "@app/ui/ioc";
    import {AppSettings} from "@app/configuration";


    @Component({})
    export default class Wizard extends Vue {
        @Inject(AppSettings)
        private appSettings: AppSettings;

        mounted() {
            if (!this.appSettings.remoteUrl) {
                this.$router.push("settings/url");
            } else if (!this.appSettings.sitemapName) {
                this.$router.push("settings/sitemap");
            } else {
                this.$router.push("/");
            }
        }

    }

</script>
