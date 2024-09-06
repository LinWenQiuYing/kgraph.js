const GRAPH_LAYOUT_ENUM = ['grid', 'dagre', 'force', 'circle', 'concentric', 'breadthfirst', 'cose', 'cola', 'random'];
let layoutIndex = 0;
let ctx = null;

function renderCxtMenu(position, menus) {
    const { x, y } = position;
    if (ctx) {
        ctx.style.top = `${y}px`;
        ctx.style.left = `${x}px`;
    } else {
        const ul = document.createElement('ul');
        ul.style.top = `${y}px`;
        ul.style.left = `${x}px`;
        ul.className = 'cxt-menu';
        ul.oncontextmenu = () => {
            return false;
        };
        menus.forEach(menu => {
            const li = document.createElement('li');
            li.innerText = menu.text;
            li.className = 'cxt-menu-item';
            li.onclick = menu.onclick;
            ul.appendChild(li);
        });
        ctx = ul;
        document.body.append(ul);
    }
}

function onCxtClick(evt) {
    if (evt.target && evt.target.isNode && evt.target.isNode()) {
        const menus = [{
            text: '添加连接',
            onclick: () => {
                graph.events.setConnectNode(evt.target);
                document.body.removeChild(ctx);
                ctx = null;
            }
        }, {
            text: '从该节点展开',
            onclick: () => {
                const eles = {
                    nodes: [{
                        data: {
                            id: 'node-expand-1',
                        }
                    }, {
                        data: {
                            id: 'node-expand-2',
                        }
                    }, {
                        data: {
                            id: 'node-expand-3',
                        }
                    }, {
                        data: {
                            id: 'node-expand-4',
                        }
                    }],
                    edges: [{
                        data: {
                            source: evt.target.id(),
                            target: 'node-expand-1',
                        }
                    }, {
                        data: {
                            source: evt.target.id(),
                            target: 'node-expand-2',
                        }
                    }, {
                        data: {
                            source: evt.target.id(),
                            target: 'node-expand-3',
                        }
                    }, {
                        data: {
                            source: evt.target.id(),
                            target: 'node-expand-4',
                        }
                    }]
                };
                graph.datas.addElementFromNode(evt.target, eles);
                document.body.removeChild(ctx);
                ctx = null;
            }
        }, {
            text: '修改样式',
            onclick: () => {
                graph.data.changeData(evt.target, {
                    backgroundImage: '//bpic.588ku.com/element_origin_min_pic/19/03/07/41011a958ed102b2ea7d29d4728e61e7.jpg'
                });
                document.body.removeChild(ctx);
                ctx = null;
            }
        }, {
            text: '锁定节点',
            onclick: () => {
                graph.events.lockNode(evt.target);
                document.body.removeChild(ctx);
                ctx = null;
            }
        }, {
            text: '删除节点',
            onclick: () => {
                graph.datas.remove(evt.target);
                document.body.removeChild(ctx);
                ctx = null;
            }
        }, {
            text: '隐藏节点',
            onclick: () => {
                graph.datas.hideElement(evt.target);
                document.body.removeChild(ctx);
                ctx = null;
            }
        }];
        renderCxtMenu(evt.renderedPosition, menus);
    }
    // 点击画布
    if (!evt.target.length) {
        const menus = [{
            text: '添加node',
            onclick: () => {
                const position = evt.renderedPosition;
                console.log(position);
                graph.datas.addNode({
                    data: {
                        id: (new Date()).getMilliseconds().toString(),
                    },
                    position
                });
                document.body.removeChild(ctx);
                ctx = null;
            }
        }, {
            text: '切换布局',
            onclick: () => {
                const layout = GRAPH_LAYOUT_ENUM[layoutIndex++ % GRAPH_LAYOUT_ENUM.length];
                graph.events.changeLayout(layout);
                document.body.removeChild(ctx);
                ctx = null;
            }
        }, {
            text: 'undo',
            onclick: () => {
                graph.history.undo();
                document.body.removeChild(ctx);
                ctx = null;
            }
        }, {
            text: 'redo',
            onclick: () => {
                graph.history.redo();
                document.body.removeChild(ctx);
                ctx = null;
            }
        }, {
            text: '获取所有节点',
            onclick: () => {
                console.log(graph.datas.allNodes());
                document.body.removeChild(ctx);
                ctx = null;
            }
        }, {
            text: '清空所有ele',
            onclick: () => {
                graph.datas.clear();
                document.body.removeChild(ctx);
                ctx = null;
            }
        }, {
            text: '获取所有关系',
            onclick: () => {
                console.log(graph.datas.allEdges());
                document.body.removeChild(ctx);
                ctx = null;
            }
        }, {
            text: '获取所有元素',
            onclick: () => {
                console.log(graph.datas.allElements());
                document.body.removeChild(ctx);
                ctx = null;
            }
        }, {
            text: '获取选中元素',
            onclick: () => {
                console.log(graph.datas.selectedElements());
                document.body.removeChild(ctx);
                ctx = null;
            }
        }, {
            text: '合并选中元素',
            onclick: () => {
                graph.events.mergeElements();
                document.body.removeChild(ctx);
                ctx = null;
            }
        }, {
            text: '拆分选中元素',
            onclick: () => {
                graph.events.unmergeElements();
                document.body.removeChild(ctx);
                ctx = null;
            }
        }, {
            text: '绑定选中元素',
            onclick: () => {
                graph.events.boundElements();
                document.body.removeChild(ctx);
                ctx = null;
            }
        }];
        renderCxtMenu(evt.renderedPosition, menus);
    }
}

const graph = new KGraph({
    containerId: 'KGraph',
    events: {},
    layout: "preset",
    initData: [
        { group: 'nodes', data: { id: 'n0' }, position: { x: 100, y: 100 } },
        { group: 'nodes', data: { id: 'n1' }, position: { x: 200, y: 200 } },
        { group: 'edges', data: { id: 'e0', source: 'n0', target: 'n1' } }
    ],
});

graph.events.on('cxtClick', onCxtClick);
graph.events.on('click', () => {
    const timer = setTimeout(() => {
        // console.log(graph.events.listenEventList);
        graph.events.off('click');
        // console.log(graph.events.listenEventList);
        clearTimeout(timer);
    }, 1000);
});

graph.events.on('nodeDblclick', evt => {
  console.log('双击节点', evt)
});

function onLayoutSelect(val) {
    console.log(val);
}
