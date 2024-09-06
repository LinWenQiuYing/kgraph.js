import { addHistory, circleLayout, createEdge, createNode, findElementById, kGraphLayouts } from "./utils";

// 统一数据操作入口，方便记录history
class KGraphDatas {
    constructor(cy, history) {
        this.cy = cy;
        this.history = history;
    }

    fromJson(json) {
        this.cy.json(json);
    }

    filter(conditions) {
        return this.cy.filter(conditions);
    }

    allNodesWithCommunity() {
        return this.cy.nodes();
    }

    allNodes() {
        return this.cy.nodes().filter('.default-node');
    }

    allEdges() {
        return this.cy.edges().filter('.default-line');
    }

    allElements() {
        return this.cy.elements().filter((ele) => {
            return !ele.data('id').includes('community');
        });
    }

    allElementsWithCommunity() {
        return this.cy.elements();
    }

    selectedNodes() {
        return this.cy.nodes().filter(':selected');
    }

    selectedEdges() {
        return this.cy.edges().filter(':selected');
    }

    selectedElements() {
        return this.cy.filter(':selected');
    }

    findElementId(id) {
        return findElementById(this.cy, id);
    }

    @addHistory
    setNodes(nodes) {
        this.cy.batch(() => {
            this.cy.nodes().remove();
            this.cy.add(nodes.map(node => createNode(node)));
        });
    }

    @addHistory
    setEdges(edges) {
        this.cy.batch(() => {
            this.cy.edges().remove();
            this.cy.add(edges.map(edge => createEdge(edge)));
        });
    }

    @addHistory
    addNode(node) {
        this.cy.add(createNode(node));
    }

    @addHistory
    addElements(elements) {
        this.cy.add(elements);
    }

    @addHistory
    addNodes(nodes) {
        Array.isArray(nodes) &&  this.cy.batch(() => {
            this.cy.add(nodes.map(node => createNode(node)));
        });
    }

    @addHistory
    addEdges(edges) {
        Array.isArray(edges) && this.cy.batch(() => {
            this.cy.add(edges.map(edge => createEdge(edge)));
        });
    }

    @addHistory
    addEdge(edge, isCytoData = false) {
        this.cy.add(isCytoData ? edge : createEdge(edge));
    }

    @addHistory
    addElementFromNode(baseNode, addEles) {
        const { nodes, edges } = addEles;
        if (nodes) {
            const originPosition = baseNode.position();
            const positions = circleLayout(originPosition, nodes.length === 1 ? 300 : nodes.length * 150, nodes.length);
            const addNodeIds = [];
            const addEdgeIds = [];
            const addNodes = nodes.map((node,index) => {
                addNodeIds.push(node.data.id);
                node.position = positions[index];
                return createNode(node);
            });
            const addEdges = edges && edges.map(edge => {
                const _edge = createEdge(edge);
                addEdgeIds.push(_edge.data.id);
                return _edge;
            }) || [];
            this.cy.batch(() => {
                this.cy.add(addNodes);
                this.cy.add(addEdges);
            });
            const addCyNodes = this.cy.nodes().filter(node => {
                return addNodeIds.includes(node.id());
            });
            this.cy.edges().forEach(edge => {
                if (addEdgeIds.includes(edge.id())) {
                    edge.select();
                }
            });
            addCyNodes.forEach((node, index) => {
                node.select();
                node.animation({
                    position: positions[index],
                    duration: 300,
                }).play();
            });
            baseNode.select();
        }
    };

    @addHistory
    addEdges(edges) {
        Array.isArray(edges) && this.cy.add(edges.map(edge => createEdge(edge)));
    }

    @addHistory
    hideElement(ele) {
        ele.addClass('hide-ele');
    }

    @addHistory
    showElement(ele) {
        ele.removeClass('hide-ele');
    }

    @addHistory
    remove(ele) {
        this.cy.remove(ele);
    }

    @addHistory
    clear() {
        this.cy.nodes().remove();
        this.cy.edges().remove();
    }

    // @addHistory
    // changeNodeStyle(ele, nodeStyle) {
    //     ele && ele.length === 1 && ele.style(nodeStyle);
    // }
    //
    // @addHistory
    // changeEdgeStyle(ele, edgeStyle) {
    //     ele && ele.length === 1 && ele.style(edgeStyle);
    // }

    // 适用于预览的情况
    changeDataWithoutHistory(ele, data) {
        const _data = Object.assign({}, ele.data, data);
        ele.data(_data);
    }

    @addHistory
    changeData(ele, data) {
        const _data = Object.assign({}, ele.data, data);
        this.cy.batch(() => {
            ele.data(_data);
        });
    }
}

export default KGraphDatas;
