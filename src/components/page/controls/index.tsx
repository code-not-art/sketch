import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Pause,
  Play,
  PenTool,
  Image,
  Save,
  Share2,
} from 'react-feather';
import styled from 'styled-components';
import ImageState from '../ImageState';
import LoopState from '../LoopState';
import { shareViaUrl } from '../share';
import ControlButton from './ControlButton';

const FixedPositionMenu = styled.div`
  position: fixed;
  bottom: 0px;
  color: rgb(170, 170, 170);
  display: flex;
  flex-direction: row;
  margin-bottom: -5px;
`;

const FixedRight = styled(FixedPositionMenu)`
  right: 0px;
  margin-right: -3px;
  div:first-child {
    border-radius: 7px 0px 0px 0px;
  }
`;
const FixedLeft = styled(FixedPositionMenu)`
  left: 0px;
  margin-left: -3px;

  div:last-child {
    border-radius: 0px 7px 0px 0px;
  }
`;

const FixedCenterWrapper = styled(FixedPositionMenu)`
  left: 0px;
  width: 100%;

  flex-direction: row;
  align-items: center;
  justify-content: center;

  background-color: rgba(0, 0, 0, 0);

  div:first-child {
    border-radius: 7px 0px 0px 0px;
  }
  div:last-child {
    border-radius: 0px 7px 0px 0px;
  }
  div:only-child {
    border-radius: 7px 7px 0px 0px;
  }
`;
const FixedCenterMenu = styled.div`
  display: flex;
`;

const ICON_SIZE = 25;

type ControlsProps = {
  state: ImageState;
  loopState: LoopState;
  params: Record<string, any>;
  draw: () => void;
  download: () => void;
  videoControls: boolean;
};
const Controls = ({
  state,
  loopState,
  params,
  draw,
  download,
  videoControls = false,
}: ControlsProps) => {
  /**
   * This updatePausedState is a bit of a kludge to accomodate the state is being managed in mutable objects.
   * So we will make sure we keep a local state that tracks the value in the loop state.
   * There are ways to improve on this system, a bit of refactoring of the ImageController can make this uneeded.
   */

  const [paused, setPausedState] = useState(loopState.paused);
  const updatePausedState = () => setPausedState(loopState.paused);
  return (
    <div>
      <FixedCenterWrapper>
        <FixedCenterMenu>
          <ControlButton
            disabled={false}
            onTouch={() => {
              download();
            }}
          >
            <Save size={ICON_SIZE} />
          </ControlButton>
          <ControlButton
            disabled={false}
            onTouch={() => {
              shareViaUrl(state, params);
            }}
          >
            <Share2 size={ICON_SIZE} />
          </ControlButton>
          {videoControls && (
            <ControlButton
              disabled={loopState.finished}
              onTouch={() => {
                loopState.togglePause();
                updatePausedState();
              }}
            >
              {paused ? <Play size={ICON_SIZE} /> : <Pause size={ICON_SIZE} />}
            </ControlButton>
          )}
        </FixedCenterMenu>
      </FixedCenterWrapper>
      <FixedLeft>
        <ControlButton
          disabled={state.activeColor === 0 || state.activeImage === 0}
          onTouch={() => {
            state.prevImage();
            state.prevColor();
            draw();
          }}
        >
          <ArrowLeft size={ICON_SIZE + 2} />
        </ControlButton>
        <ControlButton
          disabled={state.activeColor === 0}
          onTouch={() => {
            state.prevColor();
            draw();
          }}
        >
          <PenTool size={ICON_SIZE} />
        </ControlButton>
        <ControlButton
          disabled={state.activeImage === 0}
          onTouch={() => {
            state.prevImage();
            draw();
          }}
        >
          <Image size={ICON_SIZE} />
        </ControlButton>
      </FixedLeft>
      <FixedRight>
        <ControlButton
          disabled={false}
          onTouch={() => {
            state.nextImage();
            draw();
          }}
        >
          <Image size={ICON_SIZE} />
        </ControlButton>
        <ControlButton
          disabled={false}
          onTouch={() => {
            state.nextColor();
            draw();
          }}
        >
          <PenTool size={ICON_SIZE} />
        </ControlButton>

        <ControlButton
          disabled={false}
          onTouch={() => {
            state.nextImage();
            state.nextColor();
            draw();
          }}
        >
          <ArrowRight size={ICON_SIZE + 2} />
        </ControlButton>
      </FixedRight>
    </div>
  );
};

export default Controls;
