import { getWindowConfig } from "mirador";
import { createSelector } from "reselect";

const defaultConfig = {
  allowCanvasLabel: true,
  allowFirstPage: true,
  allowLastPage: true,
  handleCanvasLabel: ({ canvasLabel }) => canvasLabel,
};

/** Selector to get the plugin config for a given window */
const getPluginConfig = createSelector(
  [getWindowConfig],
  ({ canvasNavigation = {} }) => ({ ...defaultConfig, ...canvasNavigation }),
);

export { getPluginConfig };
