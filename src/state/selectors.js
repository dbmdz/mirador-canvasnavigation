import { getWindowConfig } from "mirador";
import { createSelector } from "reselect";

/** Selector to get the plugin config for a given window */
const getPluginConfig = createSelector(
  [getWindowConfig],
  ({ canvasNavigation = {} }) => canvasNavigation,
);

export { getPluginConfig };
