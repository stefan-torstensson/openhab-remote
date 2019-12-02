<template>
    <player-control :widget="widget"></player-control>
</template>

<script lang="ts">
    import Vue from "vue";
    import {Component} from "vue-property-decorator";
    import PlayerControl from "@app/ui/openhab/widgets/selection/player-control.vue";
    import {Item, Widget} from "@app/api/openhab-types";
    import {container} from "@app/ui/ioc";
    import {SitemapState} from "@app/api";
    import sinon from "ts-sinon";
    import {SinonStub} from "sinon";

    const mockWidget: Widget = {
        widgetId: "id",
        type: "Switch",
        label: "Player",
        item: {
            state: "PLAY",
            link: "http://player"
        }
    } as Widget;

    @Component({components: {PlayerControl}})
    export default class PlayerControlSample extends Vue {

        widget = mockWidget;
        private stub: SinonStub;

        mounted() {
            const sitemapState = container.get(SitemapState);
            this.stub = sinon.stub(sitemapState, "postUpdate").callsFake((item: Item, state: string) => {
                console.log(item.link, state);
                item.state = state;
                return Promise.resolve();
            });
        }

        destroyed(): void {
            this.stub.restore();
        }
    }
</script>
