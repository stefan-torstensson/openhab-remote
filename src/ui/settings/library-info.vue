<template>
    <ul class="library-info">
        <li v-for="l in libraries">
            <p class="name">{{l.name}}</p>
            <p class="description">{{l.description}}</p>
            <p class="copyright" v-if="l.copyright">{{l.copyright}}</p>
        </li>
    </ul>
</template>

<script lang="ts">
    import Vue from "vue";
    import {Component} from "vue-property-decorator";
    import libraries from "@app/libraries.json";

    interface Library {
        name: string;
        version: string;
        licenses: string;
        description?: string;
        publisher?: string;
        copyright?: string;
    }

    @Component({})
    export default class LibraryInfo extends Vue {
        get libraries(): Library[] {
            return libraries;
        }
    }
</script>

<style lang="scss" scoped>
    @import "~settings";

    .library-info {
        list-style: none;
        padding: 0;
        overflow-wrap: break-word;

        li {
            margin-bottom: 1.5em;
        }

        .name {
            font-weight: bold;
        }
    }
</style>
