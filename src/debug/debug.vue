<script lang="ts">
    import "./debug.scss";
    import Vue from "vue";
    import {Component, Watch} from "vue-property-decorator";

    @Component
    class DebugView extends Vue {
        private kbEnabled: boolean = false;

        @Watch("kbEnabled")
        changeKb(enabled: boolean) {
            if (enabled) {
                document.body.classList.add("input-enabled");
            } else {
                document.body.classList.remove("input-enabled");
            }
        }

        rotate(direction: string) {
            const event = new CustomEvent("rotarydetent", {
                detail: {direction}
            });
            document.dispatchEvent(event);
        }

        key(key: string) {
            const event = document.createEvent("Event") as any;
            event.initEvent("tizenhwkey", true, true);
            event.keyName = key;
            document.dispatchEvent(event);
        }

    }

    export default DebugView;
</script>

<template>
    <div class="debug-container">
        <button @click="key('back')">BACK</button>
        <br>
        <button @click="rotate('CCW')">CCW</button>
        <br>
        <button @click="rotate('CW')">CW</button>
        <br>
        KB: <input type="checkbox" v-model="kbEnabled">
    </div>
</template>

<style scoped>
    .debug-container {
        float: right;
        font-size: .5em;
    }
</style>
