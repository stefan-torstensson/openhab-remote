import {RouteConfig} from "vue-router";
import Default from "./default.vue";
import Slider from "./components/slider.vue";
import MultiSelect from "./components/multi-select.vue";
import ToggleIcon from "./components/toggle-icon.vue";
import ArcButton from "./components/arc-button.vue";

export const routes: RouteConfig[] = [
    {path: "*", component: Default},
    {name: "Slider", path: "/slider", component: Slider},
    {name: "MultiSelect", path: "/multi-select", component: MultiSelect},
    {name: "ToggleIcon", path: "/toggle-icon", component: ToggleIcon},
    {name: "ArcButton", path: "/arc-button", component: ArcButton},
];
