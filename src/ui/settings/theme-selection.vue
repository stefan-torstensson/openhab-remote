<template>
    <option-list v-model="theme" :options="availableThemes" heading="Theme"></option-list>
</template>

<script lang="ts">
    import Vue from "vue";
    import {Component, Watch} from "vue-property-decorator";
    import {OptionList, SelectOption} from "@app/ui/components";
    import {AppSettings} from "@app/configuration";
    import {Inject} from "@app/ui/ioc";
    import {AppEvent, PubSub} from "@app/ui/event-bus";
    import {AVAILABLE_THEMES} from "@app/ui/settings/themes";


    @Component({components: {OptionList}})
    export default class ThemeSelection extends Vue {
        @Inject(AppSettings)
        private appSettings: AppSettings;

        @Inject(PubSub)
        private pubSub: PubSub;

        private theme: string = "";

        mounted() {
            this.theme = this.appSettings.theme;
        }

        @Watch("theme")
        private saveTheme(value: string) {
            this.appSettings.theme = value;
            this.pubSub.$emit(AppEvent.THEME_CHANGE, value);
        }

        get availableThemes(): SelectOption[] {
            return AVAILABLE_THEMES.map(theme => new SelectOption(theme.className, theme.name));
        }
    }
</script>

<style lang="scss" scoped>

</style>
