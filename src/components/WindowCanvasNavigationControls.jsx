import {
  ChevronLeft as PreviousCanvasIcon,
  ChevronRight as NextCanvasIcon,
  FirstPage as FirstCanvasIcon,
  LastPage as LastCanvasIcon,
} from "@mui/icons-material";
import { Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import classNames from "classnames";
import { MiradorMenuButton } from "mirador";
import PropTypes from "prop-types";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const PREFIX = "WindowCanvasNavigationControls";

const classes = {
  canvasNav: `${PREFIX}-canvasNav`,
  container: `${PREFIX}-container`,
  canvasFooter: `${PREFIX}-canvasFooter`,
  navContainer: `${PREFIX}-navContainer`,
  canvasPosition: `${PREFIX}-canvasPosition`,
  squareButton: `${PREFIX}-squareButton`,
  edgeButtonLeft: `${PREFIX}-edgeButtonLeft`,
  edgeButtonRight: `${PREFIX}-edgeButtonRight`,
  canvasLabel: `${PREFIX}-canvasLabel`,
  canvasInput: `${PREFIX}-canvasInput`,
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  // We need to supply all the classes of the wrapped target component, otherwise MUI will
  // complain a lot
  [`&.${classes.canvasNav}`]: {
    // !important is needed since the parent component will override our style otherwise
    flexDirection: "column !important",
    bottom: 0,
    position: "absolute",
    zIndex: 50,
    width: "100%",
  },

  [`&.${classes.container}`]: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    // We need to use `!important` since the wrapped component's background color/flex direction will
    // take precedence otherwise
    backgroundColor: `${theme.palette.background.paper} !important`,
    paddingBottom: "0.25em",
    // Simulate a shadow from the viewer window above with an inset box shadow that has a negative spread
    boxShadow: "inset 0 10px 10px -10px rgba(0, 0, 0, 0.5)",
    fontSize: "medium",
  },

  [`& .${classes.canvasFooter}`]: {
    display: "flex",
    justifyContent: "center",
  },

  [`& .${classes.navContainer}`]: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: theme.palette.background.paper,
    border: "transparent",
    borderRadius: "0 0 .5rem .5rem",
    boxShadow: `0 5px 7px -1px ${
      theme.palette.type === "dark" ? "rgb(0, 0, 0)" : "rgba(0, 0, 0, 0.25)"
    }`,
    whiteSpace: "pre",
  },

  [`& .${classes.canvasPosition}`]: {
    padding: "0 0.5em",
    display: "flex",
    alignItems: "center",
    fontFamily: theme.typography.fontFamily ?? "sans-serif",
  },

  [`& .${classes.squareButton}`]: {
    borderRadius: 0,
    borderColor: "lightgrey",
    borderStyle: "solid",
    borderWidth: "0px 1px 0px 1px",
  },

  [`& .${classes.edgeButtonLeft}`]: {
    borderWidth: "0",
  },

  [`& .${classes.edgeButtonRight}`]: {
    borderWidth: "0",
  },

  [`& .${classes.canvasLabel}`]: {
    marginTop: "0.5em",
    minHeight: "1.125rem",
    color:
      theme.palette.type === "dark"
        ? theme.palette.grey[300]
        : theme.palette.grey[600],
    fontSize: "0.7rem",
    fontFamily: theme.typography.fontFamily ?? "sans-serif",
    textAlign: "center",
  },

  [`& .${classes.canvasInput}`]: {
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
  canvasId,
  canvasLabel,
  config: { handleCanvasLabel = ({ canvasLabel }) => canvasLabel },
  currentCanvasIndex,
  hasNextCanvas,
  hasPreviousCanvas,
  manifestId,
  numCanvases,
  setCanvasIndex,
  setNextCanvas,
  setPreviousCanvas,
  windowId,
}) => {
  // We have to use a controlled component, since we want our canvas index input
  // to be updated while using the pagination buttons, but we also don't want to
  // tie it directly to the canvas index, since we don't want to change canvases
  // while the user enters a number. So we tie it to an intermediary state variable
  // that gets reset whenever the change is committed
  const [pendingCanvasIdx, setPendingCanvasIdx] = useState();
  const { t } = useTranslation();
  const onChangeCanvasIndex = () => {
    if (pendingCanvasIdx === currentCanvasIndex) {
      return;
    }
    setCanvasIndex(pendingCanvasIdx);
    setPendingCanvasIdx(undefined);
  };
  const canvasLbl = handleCanvasLabel({
    canvasId,
    canvasLabel,
    currentCanvasIndex,
    manifestId,
  });
  const inputId = `canvas-idx-${windowId}`;
  return (
    <StyledPaper
      className={classNames(
        classes.container,
        // FIXME: make prefix configurable again once mirador 4 exports `ns` function
        "mirador-canvas-nav",
        classes.canvasNav,
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
          <label
            className={classNames(
              classes.canvasPosition,
              // FIXME: make prefix configurable again once mirador 4 exports `ns` function
              "mirador-canvas-position",
            )}
            htmlFor={inputId}
          >
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
              classes.edgeButtonRight,
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
    </StyledPaper>
  );
};

WindowCanvasNavigationControls.defaultProps = {
  canvasId: undefined,
  canvasLabel: "",
};

WindowCanvasNavigationControls.propTypes = {
  canvasId: PropTypes.string,
  canvasLabel: PropTypes.string,
  config: PropTypes.shape({
    handleCanvasLabel: PropTypes.func,
  }).isRequired,
  currentCanvasIndex: PropTypes.number.isRequired,
  hasNextCanvas: PropTypes.bool.isRequired,
  hasPreviousCanvas: PropTypes.bool.isRequired,
  manifestId: PropTypes.string.isRequired,
  numCanvases: PropTypes.number.isRequired,
  setCanvasIndex: PropTypes.func.isRequired,
  setNextCanvas: PropTypes.func.isRequired,
  setPreviousCanvas: PropTypes.func.isRequired,
  windowId: PropTypes.string.isRequired,
};

export default WindowCanvasNavigationControls;
