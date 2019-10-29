<template>
    <page v-if="showModal" class="modal">
        <template v-slot:header>
            <div class="center-text center-vertically modal_heading">
                {{heading}}
            </div>
        </template>
        <div class="modal_content text">
            {{content}}
        </div>
        <template v-slot:footer>
            <arc-button position="bottom" @click="hide()">
                Dismiss
            </arc-button>
        </template>
    </page>
</template>

<script lang="ts">
    import Vue from "vue";
    import {Component} from "vue-property-decorator";
    import ArcButton from "./arc-button";
    import Page from "./page";

    @Component({
        components: {Page, ArcButton}
    })
    export default class Modal extends Vue {

        private showModal: boolean = false;

        private heading: string = "";
        private content: string = "";

        show(heading: string, message: string) {
            this.heading = heading;
            this.content = message;
            this.showModal = true;
        }

        hide(): void {
            this.showModal = false;
        }

    }
</script>

<style lang="scss" scoped>
    @import "~settings";

    .modal {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: $color-background;

        &_heading {
            padding: 0 80px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;

        }

        &_content {
            padding: 0 30px;
            word-wrap: break-word;
        }
    }


</style>
