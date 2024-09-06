import { TEMP_NODE_ID, TEMP_EDGE_ID, LINE_DASH_OFFSET } from "./utils/consts";
import { uuid } from "cytoscape/src/util";
import {
  addHistory,
  circleLayout,
  createComb,
  createEdge,
  createLabel,
  createNode,
  filterCommonId,
  kGraphLayouts,
  shortcut
} from "./utils";

class KGraphEvents {

  constructor(cy, history, datas) {
    this.cy = cy;
    this.datas = datas;
    this.history = history;
    this.layout = null;
    this.listenEventList = {};
    this.initEvents(cy);
    this.connectNode = null;  // 待连接的起始节点
    this.animateLineDashOffset = LINE_DASH_OFFSET;
    this.changeLayout = this.changeLayout.bind(this);
  }

  setConnectNode(node) {
    this.connectNode = node;
  }

  on(name, fn) {
    if (typeof name === 'string' && typeof fn === 'function') {
      if (this.listenEventList[name]) {
        this.listenEventList[name].push(fn);
      } else {
        this.listenEventList[name] = [fn];
      }
    }
  }

  off(name) {
    delete this.listenEventList[name];
  }

  emit(name) {
    const events = this.listenEventList[name];
    if (events) {
      const args = Array.prototype.slice.call(arguments, 1);
      events.forEach((fn) => {
        fn(...args);
      });
    }
  }

  connectAnimate(edge) {
    this.animateLineDashOffset--;
    edge.animate({
      style: {
        'line-dash-offset': this.animateLineDashOffset,
      },
      complete: () => {
        this.connectAnimate(edge);
      },
      duration: 20
    });
  };

  watchConnecting(evt) {
    const node = this.cy.$id(TEMP_NODE_ID);
    if (node.length !== 0) {
      node.position(evt.position);
    } else {
      this.cy.batch(() => {
        this.cy.add(createNode({
          data: {
            id: TEMP_NODE_ID,
          },
          position: evt.position,
        }));
        this.cy.add(createEdge({
          data: {
            id: TEMP_EDGE_ID,
            source: this.connectNode.id(),
            target: TEMP_NODE_ID,
          },
        }));
      });
      const edge = this.cy.$id(TEMP_EDGE_ID);
      edge.length > 0 && this.connectAnimate(edge);
    }
  };

  watchConnectEnd(evt) {
    this.cy.$id(TEMP_EDGE_ID).stop().clearQueue().remove();
    this.cy.$id(TEMP_NODE_ID).remove();
    const canConnect = evt.target && evt.target.isNode && evt.target.isNode() && evt.target.id() !== TEMP_NODE_ID;
    if (canConnect) {
      const id = uuid();
      this.datas.addEdge({
        data: {
          id,
          source: this.connectNode.id(),
          target: evt.target.id(),
        },
        classes: ['default-line']
      });
      this.emit('connectEnd', evt, id);
      this.setConnectNode(null);
    } else {
      this.setConnectNode(null);
    }
  };

  watchCursorPointer() {
    this.cy.on('tapdrag', () => {
      document.body.style.cursor = 'default';
    });
    this.cy.on('tapdrag', 'node', () => {
      document.body.style.cursor = 'pointer';
    });
  }

  @addHistory
  changeLayout(layout, elements) {
    this.layout && this.layout.stop();
    const layoutJson = kGraphLayouts[layout];
    layoutJson.stop = () => {
      this.emit('layoutStop');
    };
    if (!!elements && !!elements.length) {
      this.layout = elements.layout(layoutJson);
    } else {
      this.layout = this.cy.layout(layoutJson);
    }
    this.layout.run();
    this.datas.layout = layout;
  }

  @addHistory
  lockNode(ele) {
    ele && ele.length === 1 && ele.lock();
  }

  @addHistory
  unlockNode(ele) {
    ele && ele.length === 1 && ele.unlock();
  }

  @addHistory
  selectElements(ids) {
    const eles = this.cy.filter((ids.map(id => filterCommonId(id))).join(','));
    eles.forEach(ele => ele.select());
  }

  getSelectedElementsBoundingBox() {
    return this.cy.filter(':selected').boundingBox();
  }

  @addHistory
  boundElements(eles, data) {
    const _eles = eles;
    const cloneEles = [];
    const newComb = createComb(data);
    _eles.forEach(e => {
      const eleJson = e.json();
      if (e.isNode()) {
        // parent 属性不能动态设置，只能删除原节点，再加上新节点
        eleJson.data.parent = newComb.data.id;
      }
      cloneEles.push(eleJson);
    });
    this.cy.batch(() => {
      this.cy.add(newComb);
      this.cy.remove(_eles);
      this.cy.add(cloneEles);
    });
  }

  @addHistory
  unboundElements(eles) {
    const _eles = eles || this.cy.filter(':selected');
    const cloneEles = [];
    _eles.forEach(e => {
      const eleJson = e.json();
      // parent 属性不能动态设置，只能删除原节点，再加上新节点
      eleJson.data.parent = '';
      cloneEles.push(eleJson);
    });
    this.cy.batch(() => {
      this.cy.remove(_eles);
      this.cy.add(cloneEles);
    });
  }

  @addHistory
  mergeElements(eles) {
    const _eles = eles || this.cy.filter(':selected');
    if (_eles && _eles.length > 1) {
      const boundingBox = _eles.boundingBox();
      const nodeCount = this.cy.filter('node:selected').length;
      const { x1, x2, y1, y2 } = boundingBox;
      const node = createNode({
        data: {
          backgroundImage: ['null', createLabel(nodeCount)],
          backgroundWidth: '25 20',
          backgroundHeight: '25 20',
          backgroundOffsetX: '50% 50%',
          backgroundOffsetY: '50% -50%',
          children: _eles
        },
        position: {
          x: (x1 + x2) / 2,
          y: (y1 + y2) / 2
        }
      });
      this.cy.remove(_eles);
      this.cy.add(node);
      this.cy.$id(node.data.id).select();
    }
  }

  @addHistory
  unmergeElement(ele) {
    const children = ele.data('children');
    const nodes = children.filter(child => child.isNode());
    if (children) {
      this.cy.remove(ele);
      const positions = circleLayout(ele.position(), 100, nodes.length);
      nodes.forEach((node, index) => {
        node.position(positions[index]);
      });
      this.cy.add(ele.data('children'));
    }
  }

  @addHistory
  unmergeElements(eles) {
    const _eles = eles || this.cy.filter(':selected');
    if (Array.isArray(_eles)) {
      _eles.forEach(e => {
        this.unmergeElement(e);
      });
    } else {
      this.unmergeElement(_eles);
    }
  }

  handleSelectEvent(cy) {
    cy.on('select', evt => {
      cy.batch(() => {
        const eles = this.datas.selectedElements();
        this.emit('select', eles);
      });
    });
  }

  handleKeyboardEvents = (e) => {
    console.log('event in kgraph')
    e.preventDefault()
    e.stopImmediatePropagation();
    if (shortcut(e, 'ctrl+z')) {
      e.preventDefault();
      this.history.undo();
    }

    if (shortcut(e, 'ctrl+shift+z', true, false)) {
      e.preventDefault();
      this.history.redo();
    }

    if (shortcut(e, 'delete')) {
      e.preventDefault();
      this.datas.remove(this.datas.selectedElements());
    }

    if (shortcut(e, 'ctrl+a')) {
      e.preventDefault();
      this.cy.removeListener('select');
      this.cy.batch(() => {
        this.cy.elements().select();
        this.history.pushSnapshot();
      });
      this.emit('selectAll', this.datas.allElements());
      this.handleSelectEvent(this.cy);
    }
  };

  watchKeyboard() {
    document.addEventListener('keydown', this.handleKeyboardEvents);
  }

  stopWatchKeyboard() {
    document.removeEventListener('keydown', this.handleKeyboardEvents);
  }

  dispose() {
    this.stopWatchKeyboard();
    this.cy.removeAllListeners();
  }

  initEvents(_cy) {
    const cy = _cy || this.cy;

    cy.on('tapstart', evt => {
      this.connectNode && this.watchConnectEnd(evt);
      if (!evt.target.length) { // 点击画布
        this.cy.batch(() => {
          const selected = this.cy.filter(':selected');
          selected && selected.forEach(ele => ele.unselect());
        });
      }
      this.emit('mousedown', evt);
    });

    cy.on('tapend', evt => {
      this.emit('mouseup', evt);
    });

    cy.on('tap', evt => {
      this.emit('click', evt);
    });

    cy.on('tapdrag', evt => {
      this.connectNode && this.watchConnecting(evt);
      this.emit('mousemove', evt);
    });

    cy.on('dragfree', evt => {
      this.history.push(this.cy.json());
    });

    cy.on('cxttapstart', evt => {
      this.emit('cxtMousedown', evt);
    });

    cy.on('cxttapend', evt => {
      this.emit('cxtMouseup', evt);
    });

    cy.on('cxttap', evt => {
      if (!!Object.keys(evt.target.data()).length) {
        const id = evt.target.data().id;
        const ele = this.cy.$id(id);
        if (ele?.classes?.()?.includes('default-path')) {
          return;
        }
        ele.select();
      }
      this.emit('cxtClick', evt);
    });

    this.handleSelectEvent(cy);

    cy.on('boxstart', evt => {
      this.emit('boxStart', evt);
    });

    cy.on('boxend', evt => {
      this.emit('boxEnd', evt);
    });

    cy.on('box', evt => {
      this.emit('box', evt);
    });

    cy.on('zoom', () => {
      this.emit('onZoom', cy.zoom());
    });

    cy.on('pan', () => {
      this.emit('onPanning');
    });

    cy.on('resize', () => {
      this.emit('onResize');
    });

    cy.on('dblclick', 'node', evt => {
      this.emit('nodeDblclick', evt);
    });

    this.watchCursorPointer();
    this.watchKeyboard();
  }
}

export default KGraphEvents;
