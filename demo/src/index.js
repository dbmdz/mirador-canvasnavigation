import Mirador from "mirador/dist/es/src/index";

import canvasNavigationPlugin from "../../src";

const config = {
  catalog: [
    {
      manifestId:
        "https://api.digitale-sammlungen.de/iiif/presentation/v2/bsb00135902/manifest",
      provider: "Bavarian State Library",
    },
    {
      manifestId:
        "https://api.digitale-sammlungen.de/iiif/presentation/v2/bsb10532463_00005_u001/manifest",
      provider: "Bavarian State Library",
    },
    {
      manifestId:
        "https://api.digitale-sammlungen.de/iiif/presentation/v2/bsb00034024/manifest",
      provider: "Bavarian State Library",
    },
  ],
  id: "demo",
  window: {
    allowFullscreen: true,
    canvasNavigation: {
      handleCanvasLabel: ({ canvasLabel }) => `${canvasLabel}...`,
    },
  },
  windows: [
    {
      canvasIndex: 8,
      manifestId:
        "https://api.digitale-sammlungen.de/iiif/presentation/v2/bsb00034024/manifest",
      view: "single",
    },
  ],
};

Mirador.viewer(config, [...canvasNavigationPlugin]);
