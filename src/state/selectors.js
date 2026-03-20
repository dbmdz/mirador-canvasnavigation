import { getWindowConfig } from "mirador";

/** Selector to get the plugin config for a given window */
const getPluginConfig = (state, ownProps) => {
  const { canvasNavigation = {} } = getWindowConfig(state, ownProps);
  return { ...canvasNavigation };
};

export { getPluginConfig };
