import {
  DEFAULT_NODE,
  SELECTED_NODE,
  DEFAULT_EDGE,
  TEMP_NODE_ID,
  TEMP_EDGE_ID,
  DEFAULT_COMB,
  SELECTED_EDGE,
  HIDE_ELEMENT,
  DEFAULT_PATH,
  DEFAULT_COMMUNITY,
  COLLAPSED_COMMUNITY,
  SELECTED_COLLAPSED_COMMUNITY
} from "./consts";

// style 书写的顺序对显示有影响
const graphStyles = [
    {
        selector: COLLAPSED_COMMUNITY,
        style: {
            'background-color': 'data(backgroundColor)',
            'label': 'data(name)',
            'text-valign': 'center',
            'width': 50,
            'height': 50,
            'border-color': '#5AACED',
            'border-width': 5,
            'z-index': 11,
            'background-opacity': 1,
            'opacity': 1,
            'shape': 'octagon',
            'font-size': 24,
        },
    },
    {
        selector: SELECTED_COLLAPSED_COMMUNITY,
        style: {
            'border-style': 'dashed',
        },
    },
    {
        selector: DEFAULT_COMB,
        style: {
            'z-index': 9,
            'width': '300',
            'height': '300',
        }
    }, {
        selector: DEFAULT_NODE,
        style: {
            'z-index': 10,
            'label': 'data(label)',
            'width': 'data(width)',
            'height': 'data(height)',
            'border-color': 'data(borderColor)',
            'border-width': 'data(borderWidth)',
            'shape': 'data(shape)',
            'shape-polygon-points': 'data(roundRectangleArray)',
            'opacity': 'data(opacity)',
            'color': 'data(color)',
            'font-size': 'data(fontSize)',
            'font-weight': 'data(fontWeight)',
            'text-halign': 'data(textHalign)',
            'text-valign': 'data(textValign)',
            'text-margin-y': '8',
            'text-max-width': '60px',
            'background-color': 'data(backgroundColor)',
            'background-opacity': 'data(backgroundOpacity)',
            'background-image': 'data(backgroundImage)',
            'background-width': 'data(backgroundWidth)',
            'background-height': 'data(backgroundHeight)',
            'background-offset-x': 'data(backgroundOffsetX)',
            'background-offset-y': 'data(backgroundOffsetY)',
            'background-repeat': 'no-repeat',
            'background-clip': 'none',
            'display': 'data(display)',
            'visibility': 'data(visibility)',
            'background-fit': ['none', 'none', 'none'], // note and tag should be none, otherwise the height will expand to the height of the node
            'background-position-x': 'data(backgroundX)',
            'background-position-y': 'data(backgroundY)',
        }
    }, {
      selector: DEFAULT_COMMUNITY,
      style: {
          'z-index': 10,
          'background-color': 'data(backgroundColor)',
          'background-opacity': 'data(backgroundOpacity)',
          'display': 'data(display)',
          "min-width": '200',
          "min-height": '200',
          "padding": '50',
      }
  },{
        selector: SELECTED_NODE,
        style: {
            'background-color': '#CFF0FF',
            'background-opacity': 1,
            'color': '#4EA5F2',
        }
    }, {
        selector: DEFAULT_EDGE,
        style: {
            'arrow-scale': 2,
            'label': 'data(label)',
            'width': 'data(width)',
            'color': 'data(color)',
            'font-size': 'data(fontSize)',
            'font-weight': 'data(fontWeight)',
            'text-halign': 'data(textHalign)',
            'text-valign': 'data(textValign)',
            'line-color': 'data(lineColor)',
            'opacity': 'data(opacity)',
            'curve-style': 'bezier',
            'loop-direction': 80,
            'control-point-step-size': 80,
            'target-arrow-shape': 'triangle',
            'source-distance-from-node': '6px',
            'target-distance-from-node': '6px',
            'source-arrow-color': 'data(arrowColor)',
            'target-arrow-color': 'data(arrowColor)',
            'source-endpoint': 'outside-to-node-or-label',
            'target-endpoint': 'outside-to-node-or-label',
            'text-background-color': 'data(backgroundColor)',
            'text-max-width': '60px',
            'text-background-opacity': 1,
            'text-background-padding': 5,
            'display': 'data(display)'
        }
    }, {
        selector: SELECTED_EDGE,
        style: {
            'width': 'data(width)',
            'line-color': '#4EA5F2',
            'arrow-scale': 2,
            'source-arrow-color': '#4EA5F2',
            'target-arrow-color': '#4EA5F2',
        }
    }, {
        selector: DEFAULT_COMB,
        style: {
            'z-index': 1,
            'shape': 'data(shape)',
            'background-color': 'data(backgroundColor)',
            'background-image': 'data(backgroundImage)',
            'background-width': 'data(backgroundWidth)',
            'background-height': 'data(backgroundHeight)',
            'background-offset-x': 'data(backgroundOffsetX)',
            'background-offset-y': 'data(backgroundOffsetY)',
        }
    }, {
        selector: `#${TEMP_NODE_ID}`,
        style: {
            'width': 1,
            'height': 1,
            'z-index': 1,
            'opacity': 0,
            'background-color': 'white',
        },
    }, {
        selector: `#${TEMP_EDGE_ID}`,
        style: {
            'width': 1,
            'z-index': 1,
            'arrow-scale': 2,
            'line-style': 'dashed',
            'curve-style': 'bezier',
            'target-arrow-shape': 'triangle',
            'line-color': 'rgb(24, 180, 255)',
            'line-dash-pattern': [7, 3, 7, 3],
            'target-arrow-color': 'rgb(24, 180, 255)',
        },
    }, {
        selector: DEFAULT_PATH,
        style: {
            'label': 'data(label)',
            'width': 1,
            'z-index': 1,
            'line-style': 'dashed',
            'curve-style': 'bezier',
            'line-color': 'rgb(24, 180, 255)',
            'line-dash-pattern': [7, 3, 7, 3],
            'font-size': '14',
            'font-weight': 'data(fontWeight)',
            'text-halign': 'data(textHalign)',
            'text-valign': 'data(textValign)',
            'opacity': 'data(opacity)',
            'loop-direction': 80,
            'control-point-step-size': 80,
            'source-distance-from-node': '6px',
            'target-distance-from-node': '6px',
            'source-endpoint': 'outside-to-node-or-label',
            'target-endpoint': 'outside-to-node-or-label',
            'text-background-color': 'data(backgroundColor)',
            'text-max-width': '60px',
            'text-background-opacity': 1,
            'text-background-padding': 5,
        },
    },
    {
        selector: HIDE_ELEMENT,
        style: {
            display: 'none',
        }
    }
];

export default graphStyles;

