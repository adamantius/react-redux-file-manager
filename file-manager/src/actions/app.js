export const MOVE_TO_TOP_LEVEL = 'MOVE_TO_TOP_LEVEL';
export const SELECT_PANEL_FILE = 'SELECT_PANEL_FILE';

export function moveToTopLevel() {
  return {
    type: MOVE_TO_TOP_LEVEL
  }
}

export function selectPanelFile(selectedFile, panelIndex, strategy) {
  return {
    type: SELECT_PANEL_FILE,
    selectedFile: selectedFile,
    panelIndex: panelIndex,
    strategy: strategy
  }
}

