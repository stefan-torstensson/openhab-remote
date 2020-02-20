<script lang="ts">
    import {Component} from "vue-property-decorator";
    import {Icon} from "@app/svg";
    import {equalsIgnoreCase} from "@app/common/string-utils";
    import {ListLabel, Toggle} from "@app/ui/components";
    import {Location} from "vue-router";
    import OptionControl from "@app/ui/openhab/widgets/option-control";


    @Component({
        components: {Toggle, Icon, ListLabel}
    })
    export default class SwitchControl extends OptionControl {
        get isSimpleSwitch(): boolean {
            if (this.hasCommands) {
                return false;
            }
            if (equalsIgnoreCase("rollershutter", this.item.type)) {
                return false;
            }
            if (equalsIgnoreCase("group", this.item.type) && equalsIgnoreCase("rollershutter", this.item.groupType)) {
                return false;
            }
            return true;
        }

        get link(): Location {
            return {
                params: {
                    widgetId: this.widget.widgetId
                }
            };
        }

        get checked(): boolean {
            return this.state === "ON";
        }

        set checked(value: boolean) {
            this.setState(value ? "ON" : "OFF");
        }
    }
</script>

<template>
    <toggle v-if="isSimpleSwitch" v-model="checked" :label="label"></toggle>
    <router-link v-else :to="link" class="fill-available-space ripple-effect">
        <list-label :label="label" :state="stateLabel">
            <icon type="multiselect"></icon>
        </list-label>
    </router-link>
</template>
