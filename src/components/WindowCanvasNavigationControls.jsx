import {
  ChevronLeft as PreviousCanvasIcon,
  ChevronRight as NextCanvasIcon,
  FirstPage as FirstCanvasIcon,
  LastPage as LastCanvasIcon,
} from '@mui/icons-material';

import Paper from '@mui/material/Paper';
import ns from 'mirador/dist/es/src/config/css-ns';
import MiradorMenuButton from 'mirador/dist/es/src/containers/MiradorMenuButton';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';

const CanvasFooter = styled('div')({
  display: 'flex',
  justifyContent: 'center',
});
const NavContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.paper,
  border: 'transparent',
  borderRadius: '0 0 .5rem .5rem',
  boxShadow: `0 5px 7px -1px ${
    theme.palette.mode === 'dark' ? 'rgb(0, 0, 0)' : 'rgba(0, 0, 0, 0.25)'
  }`,
  whiteSpace: 'pre',
}));
const CanvasLabel = styled('div')(({ theme }) => ({
  marginTop: '0.5em',
  minHeight: '1.125rem',
  color: theme.palette.mode === 'dark' ? theme.palette.grey[300] : theme.palette.grey[600],
  fontSize: '0.7rem',
  fontFamily: theme.typography.fontFamily ?? 'sans-serif',
}));

const SquareButton = styled(MiradorMenuButton)({
  borderRadius: 0,
  borderColor: 'lightgrey',
  borderStyle: 'solid',
  borderWidth: '0px 1px 0px 1px',
});

const SquareButtonBorder = styled(MiradorMenuButton)({
  borderRadius: 0,
  borderColor: 'lightgrey',
  borderStyle: 'solid',
  borderWidth: '0',
});

const CanvasInput = styled('input', {
  shouldForwardProp: (prop) => prop !== 'currentCanvasIndex',
})(({ currentCanvasIndex }) => {
  const numDigits = Math.floor(Math.log10(currentCanvasIndex + 1) + 1);
  const width = `${1.6 + numDigits * 0.3}rem`;

  return {
    marginLeft: '0.5rem',
    marginRight: '0.3rem',
    padding: '0 3px',
    appearance: 'textfield',
    border: '1px solid lightgrey',
    borderRadius: '.3em',
    textAlign: 'right',
    fontSize: '100%',
    width,
    '&::-webkit-outer-spin-button': {
      appearance: 'none',
    },
    '&::-webkit-inner-spin-button': {
      appearance: 'none',
    },
  };
});

const CanvasPositionLabel = styled('label')(({ theme }) => ({
  padding: '0 0.5em',
  display: 'flex',
  alignItems: 'center',
  fontFamily: theme.typography.fontFamily ?? 'sans-serif',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: `${theme.palette.background.paper}`,
  bottom: 0,
  boxShadow: 'inset 0 10px 10px -10px rgba(0, 0, 0, 0.5)',
  cursor: 'default',
  display: 'flex',
  flexDirection: 'column !important',
  flexWrap: 'wrap',
  fontSize: 'medium',
  justifyContent: 'center',
  paddingBottom: '0.25em',
  position: 'absolute',
  textAlign: 'center',
  width: '100%',
  zIndex: 50,
}));

/** WindowCanvasNavigationControls for Mirador 4 Viewer */
const WindowCanvasNavigationControls = ({
  canvasId,
  canvasLabel,
  config: { handleCanvasLabel = (lbl) => lbl },
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

  /**
   * Handles the change of the canvas index by updating the current canvas index
   * with the pending canvas index if they are different.
   *
   * @function
   * @returns {void}
   */ const onChangeCanvasIndex = () => {
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
    <StyledPaper className={ns('canvas-nav')} elevation={0} square>
      <CanvasFooter>
        <NavContainer>
          <SquareButtonBorder
            aria-label={t('firstPage')}
            disabled={!hasPreviousCanvas}
            onClick={() => setCanvasIndex(0)}
            size="small"
          >
            <FirstCanvasIcon />
          </SquareButtonBorder>
          <SquareButton
            aria-label={t('previousPage')}
            disabled={!hasPreviousCanvas}
            onClick={setPreviousCanvas}
            size="small"
          >
            <PreviousCanvasIcon />
          </SquareButton>
          <CanvasPositionLabel className={ns('canvas-position')} htmlFor={inputId}>
            {t('scan')}
            <CanvasInput
              currentCanvasIndex={currentCanvasIndex}
              id={inputId}
              max={numCanvases}
              min={1}
              onChange={(evt) => {
                const scanIdx = Number.parseInt(evt.target.value, 10);
                const isValid = !Number.isNaN(scanIdx) && scanIdx >= 1 && scanIdx <= numCanvases;
                if (!isValid) {
                  // Simply ignore invalid inputs
                  return;
                }
                // Scan number is 1-based, canvas index is 0-based
                setPendingCanvasIdx(scanIdx - 1);
              }}
              onBlur={onChangeCanvasIndex}
              onKeyUp={(evt) => {
                if (evt.key !== 'Enter') return;
                onChangeCanvasIndex();
              }}
              required
              size="small"
              type="number"
              value={(pendingCanvasIdx ?? currentCanvasIndex) + 1}
            />
            {numCanvases}
          </CanvasPositionLabel>
          <SquareButton
            aria-label={t('nextPage')}
            disabled={!hasNextCanvas}
            onClick={setNextCanvas}
            size="small"
          >
            <NextCanvasIcon />
          </SquareButton>
          <SquareButtonBorder
            aria-label={t('lastPage')}
            disabled={!hasNextCanvas}
            onClick={() => setCanvasIndex(numCanvases - 1)}
            size="small"
          >
            <LastCanvasIcon />
          </SquareButtonBorder>
        </NavContainer>
      </CanvasFooter>
      <CanvasLabel>
        {canvasLbl && (
          <>
            {t('pageLabel')}: {canvasLbl}
          </>
        )}
      </CanvasLabel>
    </StyledPaper>
  );
};

WindowCanvasNavigationControls.defaultProps = {
  canvasId: undefined,
  canvasLabel: '',
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
