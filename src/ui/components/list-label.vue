<template>
    <div class="list-control">
        <div class="list-control_text">
            <div class="list-control_label">{{label}}</div>
            <div v-if="state" class="list-control_sublabel">{{state}}</div>
        </div>
        <div class="list-control_icon">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">

    import Vue from "vue";
    import {Component, Prop} from "vue-property-decorator";

    @Component({})
    export default class ListLabel extends Vue {
        @Prop(String)
        label: string;

        @Prop(String)
        state: string;
    }

</script>
