import { getWindowConfig } from "mirador";
import { createSelector } from "reselect";

const defaultConfig = {
  handleCanvasLabel: ({ canvasLabel }) => canvasLabel,
};

/** Selector to get the plugin config for a given window */
const getPluginConfig = createSelector(
  [getWindowConfig],
  ({ canvasNavigation = {} }) => ({ ...defaultConfig, ...canvasNavigation }),
);

export { getPluginConfig };
