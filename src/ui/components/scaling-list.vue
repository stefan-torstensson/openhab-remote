<template>
    <ul :class="{'widget-list': true, 'no-heading':!heading}">
        <scaling-list-item v-if="heading">
            <div class="fill-available-space">
                <div class="center-vertically center-text list-heading">
                    {{heading}}
                </div>
            </div>
        </scaling-list-item>
        <slot></slot>
    </ul>
</template>

<script lang="ts">
    import {Component, Prop} from "vue-property-decorator";
    import Vue from "vue";
    import {StateMap} from "../state-map";
    import {logger} from "@app/common/logging";
    import {AppEvent, PubSub} from "../event-bus";
    import {Inject} from "../ioc";
    import ScalingListItem from "./scaling-list-item.vue";

    @Component({
        components: {ScalingListItem}
    })
    export default class ScalingList extends Vue {
        height: number = 360;
        radius: number;
        _lookup: number[] = [];
        _childNodes: any[];
        _repaintNeeded: boolean = false;
        _isRepainting: boolean = false;

        @Inject(PubSub)
        private pubsub: PubSub;

        @Inject(StateMap)
        private widgetState: StateMap;

        @Prop(String)
        private heading: string;

        constructor() {
            super();
            this.radius = this.height / 2;
        }

        mounted() {
            this.pubsub.$on(AppEvent.BEZEL_ROTATION, this.bezelRotation);
            this.restoreScrollPosition();
            this.$el.addEventListener("scroll", () => {
                // TODO: Debounce this
                this.saveScrollPosition();
                this.resizeChildren();

            });
            this.resizeChildren();
        }


        updated() {
            this.restoreScrollPosition();
            this.$nextTick(() => {
                this._childNodes = null;
                this.resizeChildren();
            });
        }

        beforeDestroy() {
            this.pubsub.$off(AppEvent.BEZEL_ROTATION, this.bezelRotation);
        }

        bezelRotation(direction: string) {
            const scrollSize = (direction === "CW" ? 1 : -1) * (this.height / 3);
            this.$el.scrollTop += scrollSize;
        }

        get scalingLookup() {
            if (!this._lookup) {
                const lookup: any[] = [];
                const scaleFactor = (v: number): number =>
                    Math.sqrt(1 - Math.min(1, Math.pow(v / this.radius, 2)));
                for (let i = 0; i <= this.radius; i++) {
                    lookup.push(scaleFactor(i));
                }
                this._lookup = lookup;
            }
            return this._lookup;
        }

        getChildNodes(): any[] {
            if (!this._childNodes) {
                this._childNodes = toArray(this.$el.childNodes).map(node => ({
                    offsetTop: Math.round(node.offsetTop),
                    nodeRef: node
                } as any));
            }
            return this._childNodes;
        }

        getChildNodesInView(offset: number) {
            const childNodes: any[] = this.getChildNodes() || [];
            log.debug("Child Nodes", {
                offset,
                childNodes
            });
            return childNodes.filter(node =>
                (node.offsetTop > offset - this.height / 3) && (node.offsetTop < offset + this.height));
        }

        resizeChildren() {
            log.debug("resize");
            this._repaintNeeded = true;

            if (this._isRepainting) {
                return;
            }

            const self = this;
            self._isRepainting = true;

            const list = self.$el;
            const itemTopOffset = 2 / 3 * self.radius;
            const scalingLookup = this.scalingLookup;

            function calculatePosition() {
                log.debug("calculate position");
                const scrollTop = Math.round(list.scrollTop);
                const offset = itemTopOffset + scrollTop;

                const childNodesInView = self.getChildNodesInView(scrollTop);
                log.debug("Nodes in view:", childNodesInView);

                childNodesInView.forEach(child => {
                    const position = child.offsetTop - offset;
                    const scale = scalingLookup[Math.abs(position)] || .1;
                    child.nodeRef.style.transform = `scale3d(${scale}, ${scale}, 1)`;
                });
                if (self._repaintNeeded) {
                    self._repaintNeeded = false;
                    requestAnimationFrame(calculatePosition);
                } else {
                    self._isRepainting = false;
                }
            }

            requestAnimationFrame(calculatePosition);
        }

        private get path(): string {
            return this.$route ? this.$route.path : "";
        }

        private saveScrollPosition() {
            this.widgetState.set(`scaling-list.scroll:${this.path}`, this.$el.scrollTop);
        }

        private restoreScrollPosition() {
            this.$el.scrollTop = this.widgetState.get(`scaling-list.scroll:${this.path}`, 0);
        }

    }

    function toArray(what: NodeList): any[] {
        return Array.prototype.slice.call(what);
    }

    const log = logger.get(ScalingList);
</script>

<style lang="scss">
    @import "~settings";
    @import "@app/style/ripple-effect";

    ul.widget-list {
        padding: 0;
        list-style: none;
        display: block;
        overflow: auto;
        -webkit-overflow-scrolling: auto;
        overflow-scrolling: auto;
        width: 100%;
        height: 100%;
        margin: 0;
        scroll-behavior: smooth;

        li {
            display: block;
            width: $screen-width - 8;
            height: $screen-height/3;
            padding: 0 .4em;
            margin: 0 4px;
            background-color: $color-tile;
            border: 2px solid #222;
            border-radius: $screen-height/9;
            -webkit-overflow-scrolling: touch;
            overflow-scrolling: touch;
            position: relative;
            overflow: hidden;
        }

        .list-heading {
            text-decoration: underline;
        }

        &.no-heading li:first-child {
            margin-top: 33%;
        }

        li:last-child {
            margin-bottom: 33%;
        }

        .ripple-effect {
            @include ripple-effect($color-tile);
        }

    }

    .widget-list_item {
        position: relative;
    }
</style>
