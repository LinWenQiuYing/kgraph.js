import { uuid } from "cytoscape/src/util";
import _merge from "lodash/merge";
import _cloneDeep from "lodash/cloneDeep";
import _every from 'lodash/every';

export const nodeShape = ['ellipse', 'rectangle', 'round-rectangle', 'hexagon', 'star', 'octagon', 'polygon'];

export const defaultSize = 50;

// cytoscape对中文id支持不好，需要通过这种方式查出来
export function filterCommonId(id) {
  if (!id.startsWith('[id=')) {
    return `[id="${id}"]`;
  }
  return id;
}

export function findElementById(cy, id) {
  return cy.filter(filterCommonId(id));
}

export function findElementByIds(cy, ids) {
  return cy.filter((ids.map(id => filterCommonId(id))));
}

export const defaultCombJson = {
  data: {
    id: uuid(),
    $$type: 'comb',
    shape: 'rectangle',
    backgroundColor: '#EEE',
  },
  classes: ['default-comb']
};

export function createComb(comb) {
  return _merge(_cloneDeep(defaultCombJson), comb);
}

export const defaultNodeJson = {
  data: {
    shape: 'ellipse',
    $$type: 'defaultNode',
    width: defaultSize,
    height: defaultSize,
    fontSize: 30,
    opacity: 1,
    color: '#333',
    textValign: 'bottom',
    backgroundColor: '#999',
    backgroundImage: 'none',
    backgroundWidth: '25 7',
    backgroundHeight: '25 7',
    textHalign: "center",
    textAlign: "center",
    fontWeight: 400,
    backgroundOffsetX: 0,
    backgroundOffsetY: 0,
    roundRectangleArray: "1 1 1 1",
    borderColor: "transparent",
    borderWidth: 0,
    backgroundOpacity: 1,
    label: '',
    display: 'element',
    visibility: 'visible'
  },
  classes: ['default-node']
};

export function createNode(node) {
  defaultNodeJson.data.id = uuid();
  return _merge(_cloneDeep(defaultNodeJson), node);
}

export const defaultEdgeJson = {
  data: {
    $$type: 'defaultEdge',
    width: 1,
    color: '#333',
    opacity: 1,
    fontSize: 26,
    lineColor: '#9ea5af',
    arrowColor: '#9ea5af',
    textValign: 'bottom',
    textHalign: "center",
    fontWeight: 400,
    textAlign: "center",
    label: '',
    display: 'element',
    mergeEles: [],
  },
  classes: ['default-line']
};

export function createEdge(edge) {
  defaultEdgeJson.data.id = uuid();
  return _merge(_cloneDeep(defaultEdgeJson), edge);
}

export function circleLayout(position, radius, count) {
  const perAngle = 2 * Math.PI / count;
  const positions = [];
  for (let i = 0; i < count; i++) {
    const angle = perAngle * i;
    positions.push({
      x: position.x + radius * Math.cos(angle),
      y: position.y + radius * Math.sin(angle),
    });
  }
  return positions;
}

export function createLabel(text) {
  const label = document.createElement('canvas');
  const w = 100, h = 100;
  label.width = w;
  label.height = h;
  const ctx = label.getContext('2d');
  ctx.font = '35px serif';
  ctx.fillStyle = 'rgb(255, 255, 255)';
  ctx.arc(50, 50, 30, 0, Math.PI * 2, false);
  ctx.fill();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#000';
  ctx.fillText(text, w * 0.5, h * 0.5);
  return label.toDataURL("image/png");
}

export function generateRandomElements(nodeCount, edgeCount) {
  const nodes = [];
  const edges = [];

  for (let i = 0; i < nodeCount; i++) {
    nodes.push(createNode({
      data: {
        id: `node-${i}`,
        label: `node-${i}`
      }
    }));
  }

  for (let i = 0; i < edgeCount; i++) {
    edges.push(createEdge({
      data: {
        id: `edge-${i.toString()}`,
        label: `edge-${i}`,
        source: `node-${Math.floor(Math.random() * nodeCount)}`,
        target: `node-${Math.floor(Math.random() * nodeCount)}`,
      }
    }));
  }

  return [...nodes, ...edges];
}

export function addHistory(target, key, descriptor) {
  return {
    ...descriptor,
    value(...args) {
      const newValue = () => {
        descriptor.value.apply(this, args);
        this.history.push(this.cy.json());
      };
      return newValue();
    }
  };
}

export const GRAPH_LAYOUT_ENUM = ['grid', 'dagre', 'circle', 'concentric', 'breadthfirst', 'cose', 'cola', 'random', 'force'];

export const kGraphLayouts = {
  grid: {
    name: 'grid',
    padding: 200,
    avoidOverlapPadding: 200,
    linkDistance: 100,
    fit: false,
  },
  preset: {
    name: 'preset',
    padding: 30,
  },
  dagre: {
    name: 'dagre',
    padding: 100,
    avoidOverlapPadding: 100,
    linkDistance: 100,
    spacingFactor: 2,
  },
  circle: {
    name: 'circle',
    padding: 150,
    avoidOverlapPadding: 150,
    linkDistance: 50,
  },
  cose: {
    padding: 150,
    name: 'cose',
    animate: false,
    minNodeSpacing: 100,
    nodeOverlap: 100,
    linkDistance: 500,
  },
  cola: {
    name: 'cola',
    padding: 20,
    minNodeSpacing: 100,
    avoidOverlapPadding: 20,
    edgeLength: 500
  },
  concentric: {
    name: 'concentric',
    padding: 100,
    minNodeSpacing: 100,
    avoidOverlap: true,
    avoidOverlapPadding: 50,
    linkDistance: 50,
  },
  breadthfirst: {
    name: 'breadthfirst',
    padding: 200,
    avoidOverlap: true, // 防止节点重叠，如果没有足够的空间可能会溢出boundingBox
    avoidOverlapPadding: 200,
    spacingFactor: 1.75,
    linkDistance: 100,
  },
  random: {
    name: 'random',
    padding: 200,
    avoidOverlapPadding: 200,
    linkDistance: 100,
    transform: function (node, position ){
      return { x: position.x * (2 + Math.random()), y: position.y * (2 + Math.random()) };;
    }
  },
  force: {
    name: 'd3-force',
    animate: false,
    fixedAfterDragging: true,
    linkId: function id(d) {
      return d.id;
    },
    linkDistance: 1000,
    padding: 500,
    avoidOverlapPadding: 500,
    manyBodyStrength: -10000,
    randomize: false,
    infinite: true,
    fit: false
  }
};


export function controlPressed(e) {
  return e.getModifierState('Control') || e.metaKey;
}

export function shiftPressed(e) {
  return e.getModifierState('Shift') || e.shiftKey;
}

export function keyPressed(e, key, caseSensitive) {
  return (caseSensitive ? e.key : e.key.toLowerCase()) === key;
}

export function deletePressed(e) {
  return e.key === 'Delete' || e.key === 'Backspace';
}

export function enterPressed(e) {
  return e.key === 'Enter';
}

export function escapePressed(e) {
  return e.key === 'Esc' || e.key === 'Escape';
}

export function altPressed(e) {
  return e.key === 'Alt';
}

export function shortcut(e, command, preventDefault, caseSensitive) {
  const parts = command.split('+');
  const result = _every(parts, (part) => {
    part = caseSensitive ? part.trim() : part.toLowerCase().trim();
    if (part === 'ctrl') {
      return controlPressed(e);
    } else if (part === 'shift') {
      return shiftPressed(e);
    } else if ((part === 'delete')) {
      return deletePressed(e);
    } else if (part === 'esc') {
      return escapePressed(e);
    } else if (part === 'alt') {
      return altPressed(e);
    } else if (part === 'enter') {
      return enterPressed(e);
    } else if (part.length === 1) {// match single character
      return keyPressed(e, part, caseSensitive);
    } else {
      return false;
    }
  });
  if (result) {
    if (preventDefault && e.preventDefault) {
      e.preventDefault();
    }
  }
  return result;
}

