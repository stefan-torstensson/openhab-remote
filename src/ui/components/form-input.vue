<template>
    <div class="form-input">
        <label :for="'c' + _uid" class="form-input_label">{{label}}</label>
        <input :id="'c' + _uid" :type="type" class="form-input_input" :value="value" @input="changed"
               :placeholder="placeholder">
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import {Component, Emit, Model, Prop} from "vue-property-decorator";

    @Component({components: {}})
    export default class FormInput extends Vue {
        @Prop({type: String, default: "text"})
        type: string;

        @Prop({type: String, default: ""})
        label: string;

        @Prop({type: String, default: ""})
        placeholder: string;

        @Model("change", {type: String})
        value: string;

        @Emit("change")
        changed(e: Event) {
            const target = e.target as HTMLInputElement;
            return target.value;
        }
    }
</script>

<style lang="scss" scoped>
    @import '~settings';
    @import "~theming";

    .form-input {
        &_label {
            font-size: .75em;
            font-weight: normal;
            text-align: left;
            @include theme-color-accent();
        }

        &_input {
            width: 100%;
            background: $color-background;
            color: $color-primary;
            font-size: inherit;
            border: none;
            border-bottom: 2px solid $color-primary;
        }
    }

</style>
