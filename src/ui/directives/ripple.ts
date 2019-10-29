import Vue from "vue";

const rippleClass = "ripple-effect";
const activeClass = `${rippleClass}--active`;

Vue.directive("ripple", {
    bind(el, binding, vnode) {
        el.classList.add(rippleClass);
        el.addEventListener("click", (e: MouseEvent) => {
            if (!el.classList.contains(rippleClass)) {
                // Re-added since router-link resets the classes not in markup
                el.classList.add(rippleClass);
            }
            el.classList.add(activeClass);
            setTimeout(() => el.classList.remove(activeClass), 200);
        });
    }
});
