<template>
    <icon :type="type" :class="{active}"></icon>
</template>

<script lang="ts">
    import {Component, Prop} from "vue-property-decorator";
    import Icon from "@app/svg/icon.vue";

    @Component({components: {Icon}})
    export default class ToggleIcon extends Icon {
        @Prop({type: Boolean, default: false})
        active: boolean;
    }
</script>

<style lang="scss" scoped>
    @import "~settings";

    .svg-icon {
        stroke: $color-inactive;
    }
</style>
