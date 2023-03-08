import {
  setCanvas,
  setNextCanvas,
  setPreviousCanvas,
} from "mirador/dist/es/src/state/actions";
import {
  getCanvases,
  getCanvasGroupings,
  getCanvasIndex,
  getCanvasLabel,
  getCurrentCanvas,
  getNextCanvasGrouping,
  getPreviousCanvasGrouping,
  getWindowViewType,
} from "mirador/dist/es/src/state/selectors";

import WindowCanvasNavigationControls from "./components/WindowCanvasNavigationControls";
import translations from "./locales";
import { getPluginConfig } from "./state/selectors";

export default [
  {
    component: WindowCanvasNavigationControls,
    config: {
      translations,
    },
    mapDispatchToProps: (dispatch, { windowId }) => ({
      setCanvasIndex: (index) =>
        dispatch((_, getState) => {
          const allGroupings = getCanvasGroupings(getState(), { windowId });
          const viewType = getWindowViewType(getState(), { windowId });
          const groupIndex =
            viewType === "single" ? index : Math.ceil(index / 2);
          const newGroup = allGroupings?.[groupIndex];
          const ids = (newGroup || []).map((c) => c.id);
          if (newGroup) {
            dispatch(setCanvas(windowId, ids[0], ids));
          }
        }),
      setNextCanvas: () => dispatch(setNextCanvas(windowId)),
      setPreviousCanvas: () => dispatch(setPreviousCanvas(windowId)),
    }),
    mapStateToProps: (state, { windowId }) => {
      const canvases = getCanvases(state, { windowId });
      const canvasId = (getCurrentCanvas(state, { windowId }) || {}).id;
      return {
        canvasLabel: getCanvasLabel(state, {
          canvasId,
          windowId,
        }),
        config: getPluginConfig(state, { windowId }),
        currentCanvasIndex: getCanvasIndex(state, { windowId }),
        hasNextCanvas: !!getNextCanvasGrouping(state, { windowId }),
        hasPreviousCanvas: !!getPreviousCanvasGrouping(state, {
          windowId,
        }),
        numCanvases: canvases.length,
      };
    },
    mode: "wrap",
    target: "WindowCanvasNavigationControls",
  },
];
