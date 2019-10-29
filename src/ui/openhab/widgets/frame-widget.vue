<script lang="ts">
    import {Component} from "vue-property-decorator";
    import WidgetControl from "./widget-control";
    import {ListLabel} from "@app/ui/components";

    @Component({
        components: {ListLabel}
    })
    export default class FrameWidget extends WidgetControl {}
</script>

<template>
    <div class="frame-widget list-control">
        <list-label :label="label"></list-label>
    </div>
</template>

<style lang="scss" scoped>
    @import "~settings";

    .frame-widget {
        border-bottom: 1px solid $color-primary;
    }
</style>
