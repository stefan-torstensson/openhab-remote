<script lang="ts">
    import Vue from "vue";
    import {Component, Emit, Model, Prop} from "vue-property-decorator";
    import {ToggleIcon} from "@app/svg";
    import {ListLabel} from "@app/ui/components";

    @Component({
        components: {ListLabel, ToggleIcon}
    })
    export default class Toggle extends Vue {
        @Model("change", {type: Boolean, default: false})
        checked: boolean;

        @Prop(String)
        label: string;

        @Emit("change")
        changed(e: Event) {
            const target = e.target as HTMLInputElement;
            return target.checked;
        }
    }
</script>

<template>
    <div>
        <input class="hidden" type="checkbox" :id="'c_' + _uid" :checked="checked" @change="changed">
        <label :for="'c_' + _uid" tabindex="0" class="fill-available-space ripple-effect">
            <list-label :label="label">
                <toggle-icon type="toggle" :active="checked"></toggle-icon>
            </list-label>
        </label>
    </div>
</template>
