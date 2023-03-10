import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {
  ChevronLeft as PreviousCanvasIcon,
  ChevronRight as NextCanvasIcon,
  FirstPage as FirstCanvasIcon,
  LastPage as LastCanvasIcon,
} from "@material-ui/icons";
import classNames from "classnames";
import ns from "mirador/dist/es/src/config/css-ns";
import MiradorMenuButton from "mirador/dist/es/src/containers/MiradorMenuButton";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

/** Build CSS classes used by the component, taking into account the theme.
 *
 * For more information on the theme, check out the default theme (with light and dark variations)
 * on GitHub: https://github.com/ProjectMirador/mirador/blob/master/src/config/settings.js#L11-L217
 *
 * It's usually a good idea to rely at least on the palette (`theme.palette`) for color selection, this
 * should minimize the conflict with existing themes.
 *
 * The returned object maps class names to JSS (https://cssinjs.org/), these class names are keys in
 * the `classes` prop passed to the component and will resolve to the auto-generated CSS class name
 * at runtime.
 */
const useStyles = makeStyles((theme) => ({
  // We need to supply all the classes of the wrapped target compomnent, otherwise MUI will
  // complain a lot
  canvasNav: {
    // !important is needed since the parent component will override our style otherwise
    flexDirection: "column !important",
  },
  container: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    // We need to use `!important` since the wrapped compoment's background color/flex direction will
    // take precedence otherwise
    backgroundColor: `${theme.palette.background.paper} !important`,
    paddingBottom: "0.25em",
    // Simulate a shadow from the viewer window above with an inset box shadow that has a negative spread
    boxShadow: "inset 0 10px 10px -10px rgba(0, 0, 0, 0.5)",
    fontSize: "medium",
  },
  canvasFooter: {
    display: "flex",
    justifyContent: "center",
  },
  navContainer: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: theme.palette.background.paper,
    border: "transparent",
    borderRadius: "0 0 .5rem .5rem",
    boxShadow: "0 5px 7px -1px rgba(0, 0, 0, 0.25)",
    whiteSpace: "pre",
  },
  canvasPosition: {
    padding: "0 0.5em",
    display: "flex",
    alignItems: "center",
    fontFamily: "sans-serif",
  },
  squareButton: {
    borderRadius: 0,
    borderColor: "lightgrey",
    borderStyle: "solid",
    borderWidth: "0px 1px 0px 1px",
  },
  edgeButtonLeft: {
    borderWidth: "0",
  },
  edgeButtonRight: {
    borderWidth: "0",
  },
  canvasLabel: {
    marginTop: "0.5em",
    minHeight: "1.125rem",
    color:
      theme.palette.type === "dark"
        ? theme.palette.grey[300]
        : theme.palette.grey[600],
    fontSize: "0.7rem",
    fontFamily: "sans-serif",
  },
  canvasInput: {
    marginLeft: "0.5rem",
    marginRight: "0.3rem",
    padding: "0 3px",
    appearance: "textfield",
    border: "1px solid lightgrey",
    borderRadius: ".3em",
    textAlign: "right",
    fontSize: "100%",
    "&::-webkit-outer-spin-button": {
      appearance: "none",
    },
    "&::-webkit-inner-spin-button": {
      appearance: "none",
    },
    // Styles can be a function that accepts the component's props and which will be
    // called anytime the component is updated, neat for dynamic styling
    width: ({ currentCanvasIndex }) => {
      const numDigits = Math.floor(Math.log10(currentCanvasIndex + 1) + 1);
      return `${1.6 + numDigits * 0.3}rem`;
    },
  },
}));

const WindowCanvasNavigationControls = ({
  canvasLabel,
  config: { handleCanvasLabel = (lbl) => lbl },
  currentCanvasIndex,
  hasNextCanvas,
  hasPreviousCanvas,
  numCanvases,
  setCanvasIndex,
  setNextCanvas,
  setPreviousCanvas,
  targetProps,
  windowId,
}) => {
  // We have to use a controlled component, since we want our canvas index input
  // to be updated while using the pagination buttons, but we also don't want to
  // tie it directly to the canvas index, since we don't want to change canvases
  // while the user enters a number. So we tie it to an intermediary state variable
  // that gets reset whenever the change is committed
  const [pendingCanvasIdx, setPendingCanvasIdx] = useState();
  const classes = useStyles({ currentCanvasIndex });
  const { t } = useTranslation();
  const onChangeCanvasIndex = () => {
    if (pendingCanvasIdx === currentCanvasIndex) {
      return;
    }
    setCanvasIndex(pendingCanvasIdx);
    setPendingCanvasIdx(undefined);
  };
  const canvasLbl = handleCanvasLabel(canvasLabel, currentCanvasIndex);
  const inputId = `canvas-idx-${windowId}`;
  return (
    <Paper
      className={classNames(
        targetProps.classes.controls,
        classes.container,
        ns("canvas-nav"),
        targetProps.classes.canvasNav,
        classes.canvasNav
      )}
      elevation={0}
      square
    >
      <div className={classes.canvasFooter}>
        <div className={classes.navContainer}>
          <MiradorMenuButton
            aria-label={t("firstPage")}
            className={classNames(classes.squareButton, classes.edgeButtonLeft)}
            disabled={!hasPreviousCanvas}
            onClick={() => setCanvasIndex(0)}
            size="small"
          >
            <FirstCanvasIcon />
          </MiradorMenuButton>
          <MiradorMenuButton
            aria-label={t("previousPage")}
            className={classes.squareButton}
            disabled={!hasPreviousCanvas}
            onClick={setPreviousCanvas}
            size="small"
          >
            <PreviousCanvasIcon />
          </MiradorMenuButton>
          <label className={classes.canvasPosition} htmlFor={inputId}>
            {t("scan")}
            <input
              className={classes.canvasInput}
              id={inputId}
              max={numCanvases}
              min={1}
              onChange={(evt) => {
                const scanIdx = Number.parseInt(evt.target.value, 10);
                const isValid =
                  !Number.isNaN(scanIdx) &&
                  scanIdx >= 1 &&
                  scanIdx <= numCanvases;
                if (!isValid) {
                  // Simply ignore invalid inputs
                  return;
                }
                // Scan number is 1-based, canvas index is 0-based
                setPendingCanvasIdx(scanIdx - 1);
              }}
              onBlur={onChangeCanvasIndex}
              onKeyUp={(evt) => {
                if (evt.key !== "Enter") return;
                onChangeCanvasIndex();
              }}
              required
              size="small"
              type="number"
              value={(pendingCanvasIdx ?? currentCanvasIndex) + 1}
            />
            / {numCanvases}
          </label>
          <MiradorMenuButton
            aria-label={t("nextPage")}
            className={classes.squareButton}
            disabled={!hasNextCanvas}
            onClick={setNextCanvas}
            size="small"
          >
            <NextCanvasIcon />
          </MiradorMenuButton>
          <MiradorMenuButton
            aria-label={t("lastPage")}
            className={classNames(
              classes.squareButton,
              classes.edgeButtonRight
            )}
            disabled={!hasNextCanvas}
            onClick={() => setCanvasIndex(numCanvases - 1)}
            size="small"
          >
            <LastCanvasIcon />
          </MiradorMenuButton>
        </div>
      </div>
      <div className={classes.canvasLabel}>
        {canvasLbl && (
          <>
            {t("pageLabel")}: {canvasLbl}
          </>
        )}
      </div>
    </Paper>
  );
};

WindowCanvasNavigationControls.propTypes = {
  canvasLabel: PropTypes.string.isRequired,
  config: PropTypes.shape({
    handleCanvasLabel: PropTypes.func,
  }).isRequired,
  currentCanvasIndex: PropTypes.number.isRequired,
  hasNextCanvas: PropTypes.bool.isRequired,
  hasPreviousCanvas: PropTypes.bool.isRequired,
  numCanvases: PropTypes.number.isRequired,
  setCanvasIndex: PropTypes.func.isRequired,
  setNextCanvas: PropTypes.func.isRequired,
  setPreviousCanvas: PropTypes.func.isRequired,
  targetProps: PropTypes.shape({
    classes: PropTypes.shape({
      canvasNav: PropTypes.string.isRequired,
      controls: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  windowId: PropTypes.string.isRequired,
};

export default WindowCanvasNavigationControls;
