<template>
    <scaling-list :heading="heading">
        <scaling-list-item v-for="option in options" :key="option.value">
            <div class="list-control list-item" :class="option.className">
                <input type="radio" :id="'c_' + option.value" :value="option.value" :checked="isSelected(option.value)"
                       @change="changed">
                <label :for="'c_' + option.value" tabindex="0" class="fill-available-space ripple-effect" >
                    <span class="list-control_text">
                        <span class="list-control_label">{{option.label}}</span>
                        <span v-if="option.description" class="list-control_sublabel">{{option.description}}</span>
                    </span>
                    <toggle-icon type="selected" :active="isSelected(option.value)"
                                 class="list-control_icon"></toggle-icon>
                </label>
            </div>
        </scaling-list-item>
    </scaling-list>
</template>

<script lang="ts">
    import Vue from "vue";
    import {Component, Emit, Model, Prop} from "vue-property-decorator";
    import ScalingList from "./scaling-list.vue";
    import ScalingListItem from "./scaling-list-item.vue";
    import {ToggleIcon} from "@app/svg";
    import {SelectOption} from "./select-option";

    @Component({
        components: {ScalingList, ScalingListItem, ToggleIcon}
    })
    export default class OptionList extends Vue {
        @Prop(Array)
        options: SelectOption[];

        @Prop({type: String, default: ""})
        heading: string;

        @Model("change", {type: String, default: ""})
        selected: string;

        @Emit("change")
        changed(e: Event) {
            const target = e.target as HTMLInputElement;
            return target.value;
        }

        isSelected(value: string): boolean {
            return this.selected === value;
        }
    }
</script>

