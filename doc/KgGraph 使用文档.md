# KGraph 使用文档

##### 1. KGraph是什么？

KGraph是基于cytoscape封装的一套图谱展示工具，提供了自定义节点与边样式、添加节点间连线、合并图谱元素、组合图谱元素，undo/redo等功能。

##### 2. KGraph的一些概念

| 名称 | 含义                             |
| ---- | -------------------------------- |
| node | 代表图谱中的一个单一节点         |
| edge | 代表图谱中的一个单一连线（关系） |
| ele  | 代表图谱中的一个node或者edge     |

```javascript
nodes.connectedEdges(); // 获取nodes相连的edges
edges.connectedNodes(); // 获取nodes相连的edges
ele.id();               // 获取一个元素的id
ele.data();             // 获取一个元素的data信息
ele.selected();      // 判断一个元素是否被选中
ele.isNode();        // 判断一个元素是否是node
ele.isEdge();        // 判断一个元素是否是edge
ele.hasClass(class); // 判断一个元素是否包含某个class
eles.neighborhood(); // 获取某个元素的邻居元素
```

更多信息，可以参考https://js.cytoscape.org/，KGraph不建议直接使用cyto的方法，否则undo/redo会失效，建议对cyto的方法封装一层后，调用graph.history.pushSnapshot(); 保存此次快照，具体详解下文的graph.history内容。

##### 3. KGraph的使用手册

- 初始化KGraph

```javascript
const graph = new KGraph({
    containerId: 'KGraph'
});
```

想要初始化一个KGraph，十分简单，只需要提供一个html存在的dom节点的id即可，graph实例主要有三大功能块：graph.datas(数据操作相关api，如增删改查)、graph.events(图谱操作相关api，如节点间连线、合并元素、组合元素等)、graph.history(图谱历史相关api，如undo、redo)。

- graph.datas

```javascript
// 添加一个node
graph.datas.addNode({
	data: {
        id: 'node', // 必填项
        shape: 'rectangle', 
        label: 'node',
        $$type: 'defaultNode', 
        width: 50,
        height: 50,
        backgroundColor: '#999',
        backgroundImage: 'none',
        backgroundWidth:'25 7',
        backgroundHeight:'25 7',
        backgroundOffsetX : '50% 50%',
        backgroundOffsetY : '50% 50%',
        customData: {}
    },
    classes: ['default-node'],
    position: {
        x: 100,
        y: 100,
    },
    groups: 'nodes'
});

// 添加nodes(覆盖)
graph.datas.setNodes([
    {
        data: {
            id: 'node1', // 必填项
        },
    },
    {
        data: {
            id: 'node2', // 必填项
        },
    }
]);

// 添加一个edge
graph.datas.addEdge({
    data: {
        id: 'edge',
        source: 'node-1',
        target: 'node-2',
        label: 'label',
        $$type: 'defaultEdge',
        width: 2,
        opacity: 1,
        lineColor: '#999',
        arrowColor: '#999',
    },
    classes: ['default-line']
});

// 添加edges(覆盖)
graph.datas.setEdges([
    {
        data: {
            id: 'edge1',
            source: 'node-1',
            target: 'node-2',
        },
    {
        data: {
        	id: 'edge2',
            source: 'node-2',
            target: 'node-3',
        },
    }
]);

// 从json中生成图谱
graph.datas.fromJson(fromJson); // 这里的fromJson可以从graph.history.getSnapshot()中获得

// 获取所有的node
graph.datas.allNodes();

// 获取所有的edge
graph.datas.allEdges();

// 获取所有的ele
graph.datas.allElements();

// 获取选中的ele
graph.datas.selectedElements();

// 自定义筛选条件
graph.datas.filter('.default-node'); // 获取所有classes包含default-node
graph.datas.filter('node:selected'); // 获取所有选中的节点

// 隐藏一个ele
graph.datas.hideElement(ele);

// 显示一个ele
graph.datas.showElement(ele);

// 改变一个ele的data数据
graph.datas.changeData(ele, data);

// 删除一个ele或者多个eles
graph.datas.remove(ele|eles);
```

node json

| 属性                   | 含义                                           | 值                                                                                                                      |
| ---------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| data.id                | node的唯一标识                                 | 必填项，值必须唯一                                                                                                      |
| data.shape             | node的形状                                     | 选填项，默认值为rectangle，可选值有['ellipse', 'rectangle', 'round-rectangle', 'hexagon', 'star', 'octagon', 'polygon'] |
| data.label             | node的label信息                                | 选填项                                                                                                                  |
| data.$$type            | node的类型，可以借助该属性对node分类           | 选填项，默认值为defaultNode                                                                                             |
| data.width             | node的width                                    | 选填项，默认为25                                                                                                        |
| data.height            | node的height                                   | 选填项，默认为25                                                                                                        |
| data.opacity           | node的透明度                                   | 选填项，默认为1                                                                                                         |
| data.backgroundColor   | node的背景颜色                                 | 选填项，默认为#999                                                                                                      |
| data.backgroundImage   | node的背景图片                                 | 选填项，默认为'none'，多组背景图片可以写成['image1 url'，'image url2']                                                  |
| data.backgroundWidth   | node的背景图片的width                          | 多组背景图片可以写成'25 7'，以空格分开                                                                                  |
| data.backgroundHeight  | node的背景图片的height                         | 多组背景图片可以写成'25 7'，以空格分开                                                                                  |
| data.backgroundOffsetX | node的背景图片的x偏移量                        | 多组背景图片可以写成'50% 50%'，以空格分开                                                                               |
| data.backgroundOffsetY | node的背景图片的y偏移量                        | 多组背景图片可以写成'50% 50%'，以空格分开                                                                               |
| data.customData        | 用户自定义的节点数据                           |                                                                                                                         |
| classes                | node的展现样式，通常用于规定一类edge的展示样式 | 默认为default-node                                                                                                      |
| position               | 自定义节点的位置                               | 需要配合preset的layout使用                                                                                              |

edge json

| 属性            | 含义                                           | 值                          |
| --------------- | ---------------------------------------------- | --------------------------- |
| data.id         | edge的唯一标识                                 | 必填项，值必须唯一          |
| data.source     | edge的起点node id                              | 必填项                      |
| data.target     | edge的终点node id                              | 必填项                      |
| data.label      | edge的label信息                                | 选填项                      |
| data.$$type     | edge的类型，可以借助该属性对edge分类           | 选填项，默认值为defaultEdge |
| data.width      | edge的width                                    | 选填项，默认为2             |
| data.lineColor  | edge的颜色                                     | 选填项，默认为#999          |
| data.opacity    | edge的透明度                                   | 选填项，默认为1             |
| data.arrowColor | edge 箭头的颜色                                | 选填项，默认为#999          |
| data.customData | 用户自定义的节点数据                           |                             |
| classes         | edge的展现样式，通常用于规定一类edge的展示样式 | 默认为default-edge          |

- 自定义全局class，注意这里是KGraph，而不是graph实例

```javascript
KGraph.registerNodeStyle(className, nodeStyleJson);
KGraph.registerEdgeStyle(className, edgeStyleJson);

//nodeStyleJson例子
nodeStyleJson = {
    'z-index': 10,
    'width': 'data(width)', // data(width)表示使用node.data里面的数据
    'height': 'data(height)',
    'shape': 'data(shape)',
    'opacity': 'data(opacity)',
    'background-color': 'data(backgroundColor)',
    'background-image': 'data(backgroundImage)',
    'background-width': 'data(backgroundWidth)',
    'background-height': 'data(backgroundHeight)',
    'background-offset-x': 'data(backgroundOffsetX)',
    'background-offset-y': 'data(backgroundOffsetY)',
}

edgeStyleJson= {
    'arrow-scale': 1,
    'width': 'data(width)',
    'line-color': 'data(lineColor)',
    'opacity': 'data(opacity)',
    'curve-style': 'bezier',
    'source-distance-from-node': '6px',
    'target-distance-from-node': '6px',
    'source-arrow-color': 'data(arrowColor)',
    'target-arrow-color': 'data(arrowColor)',
    'source-endpoint': 'outside-to-node-or-label',
    'target-endpoint': 'outside-to-node-or-label',
}
```

- graph.events

```javascript
// 设置连线起点node
graph.events.setConnectNode(node);

// 锁定一个节点
graph.events.lockNode(node);

// 解锁一个节点
graph.events.unlockNode(node);

// 选择元素(参数为元素id)
graph.events.selectElements(ids);

// 组合一些元素
graph.events.boundElements(eles);   // eles为空，则为当前选中元素

// 解除组合一些元素
graph.events.unboundElements(eles); // eles为空，则为当前选中元素

// 合并一些元素
graph.events.mergeElements(eles);   // eles为空，则为当前选中元素

// 解除合并一些元素
graph.events.unmergeElements(eles); // eles为空，则为当前选中元素

// 清楚所有事件绑定
graph.events.dispose();
```

- 除了上述事件外，用户还可以自定义KGraph事件

```javascript
// evt.target 代表的是图中的ele，如果不存在，代表事件处理的对象是画布
function onCxtClick(evt) { 
    if (evt.target && evt.target.isNode && evt.target.isNode()) {
        console.log('在node上点击了鼠标右键')
    }
    if (evt.target.length) {
        console.log('在画布上点击了鼠标右键')
    }
}

const graph = new KGraph({
    containerId: 'KGraph',
});

graph.events.on('cxtClick',onCxtClick);
```

目前，KGraph支持用户自定义的事件有：

> onMousedown: 鼠标按下事件
>
> onMouseup: 鼠标放开事件
>
> onMousemove: 鼠标移动事件
>
> onClick: 鼠标点击事件
>
> onCxtMousedown: 鼠标右键按下事件
>
> onCtxMouseup: 鼠标右键放开事件
>
> onCtxClick: 鼠标右键点击事件

- graph.history

```javascript
// 获取当前图谱的快照
graph.history.getSnapshot();

// 将当前图谱快照加入操作历史中，用于自定义封装一些cyto的原装方法
pushSnapshot() {
    this.push(this.cy.json());
}

// undo
graph.history.undo();

// redo
graph.history.redo();
```