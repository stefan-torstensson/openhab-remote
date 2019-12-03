<template>
    <div class="fill-available-space">
        <div :is="component" :widget="widget"></div>
    </div>
</template>

<script lang="ts">
    import Component from "vue-class-component";
    import WidgetControl from "./widget-control";
    import RollerShutter from "./selection/roller-shutter.vue";
    import OptionList from "./selection/option-list.vue";
    import PlayerControl from "./selection/player-control.vue";

    @Component({})
    export default class SelectionControl extends WidgetControl {

        get component(): new (...args: any[]) => WidgetControl {
            switch (this.item && this.item.type) {
                case "Rollershutter":
                    return RollerShutter;
                case "Player":
                    return PlayerControl;
                default:
                    return OptionList;
            }
        }
    }

</script>
