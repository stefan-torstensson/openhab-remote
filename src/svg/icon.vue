<template>
    <div :is="type"></div>
</template>

<script lang="ts">
    import Vue from "vue";
    import {Component, Prop} from "vue-property-decorator";
    import Toggle from "./toggle.svg";
    import Selected from "./selected.svg";
    import Arrow from "./arrow.svg";
    import Multiselect from "./multiselect.svg";
    import Volume from "./volume.svg";
    import Info from "./info.svg";

    @Component({
        components: {Toggle, Selected, Arrow, Multiselect, Volume, Info}
    })
    export default class Icon extends Vue {
        @Prop({type: String, default: "arrow"})
        type: string;
    }
</script>

<style lang="scss" scoped>
    @import "~settings";

    .svg-icon {

        &_elem--active {
            & {
                display: none;
            }
        }

        &.active {
            stroke: $color-active;

            .svg-icon_elem--active {
                display: inherit;
            }

            .svg-icon_elem--inactive {
                display: none;
            }
        }
    }

</style>
