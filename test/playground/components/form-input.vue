<template>
    <div class="center-vertically" style="margin: 0 40px">
        <form-input v-model="value" label="Form label"></form-input>
        <br>
        <div>Value: {{value}}</div>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import {Component} from "vue-property-decorator";
    import {FormInput} from "@app/ui/components";

    @Component({components: {FormInput}})
    export default class FormInputTest extends Vue {
        value: string = "Hello";
    }
</script>

<style lang="scss" scoped>

</style>
