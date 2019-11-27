import {Widget} from "@app/api/openhab-types";

export function findWidgetById(widgets: Widget[], id: string): Widget {
    if (widgets && widgets.length) {
        for (const widget of widgets) {
            if (widget.widgetId === id) {
                return widget;
            }
            if (id.startsWith(widget.widgetId)) {
                return findWidgetById(widget.widgets, id);
            }
        }
    }
    return null;
}
