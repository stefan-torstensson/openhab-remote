<template>
    <option-list v-model="value" :options="options" :heading="label"></option-list>
</template>

<script lang="ts">
    import {Component} from "vue-property-decorator";
    import {OptionList, SelectOption} from "@app/ui/components";
    import OptionControl from "@app/ui/openhab/widgets/option-control";

    @Component({components: {OptionList}})
    export default class OptionListControl extends OptionControl {
        get options() {
            return this.commandOptions.map(m => new SelectOption(m.command, m.label));
        }

        get value(): string {
            return this.state;
        }

        set value(value: string) {
            this.setState("" + value);
        }
    }
</script>
