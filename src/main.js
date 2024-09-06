import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import cola from 'cytoscape-cola';
import d3Force from 'cytoscape-d3-force';
import coseBilkent from 'cytoscape-cose-bilkent';
import graphStyles from './utils/style';
import KGraphDatas from "./datas";
import KGraphEvents from "./events";
import KgHistory from "./history";
import { createEdge, createNode } from './utils';

cytoscape.use(d3Force);
cytoscape.use(dagre);
cytoscape.use(cola);
cytoscape.use(coseBilkent);

class KGraph {
    static styles = graphStyles;

    checkOptions(options) {
        let flag = false;

        if (!options) {
            console.error('请设置graph的options');
            flag = true;
        } else {
            if (!options.containerId) {
                console.error('请设置graph绑定的节点id');
                flag = true;
            }
            if (options.styles && !Array.isArray(options.styles)) {
                flag = true;
                console.error('styles必须为数组类型');
            }
        }
        return flag;
    }

    // className: 注册节点的classes名称，注意唯一性， style: 注册节点的样式json
    static registerNodeStyle(className, style) {
        const _style = {
            selector: `node.${className}`,
            style,
        };
        KGraph.styles.push(_style);
    }

    static registerEdgeStyle(className, style) {
        const _style = {
            selector: `edge.${className}`,
            style,
        };
        KGraph.styles.push(_style);
    }

    //注册样式
    static registerStyle(selector, style) {
        const _style = {
            selector,
            style,
        };
        KGraph.styles.push(_style);
    }

    /* cyto插件扩展入口 */
    static extend(lib) {
        cytoscape.use(lib);
    }

    /**
     * options: 绘图的配置项
     *   containerId: 必填项，用来获取绘图的dom节点
     *   callbacks: 选填项，用来设置绘图的回调函数
     *     initData: 设置图谱的初始数据
    **/
    constructor(options) {
        if (!this.checkOptions(options)) {
            this.containerId = options.containerId;
            const {
                initData,
                maxZoom,
                minZoom,
                zoom = '',
                pan = '',
                styles,
                styleOverride = false,
                hideEdgesOnViewport = false,
                textureOnViewport = false,
                userPanningEnabled = true,
                userZoomingEnabled = true,
                autolock = false,
                wheelSensitivity = .5
            } = options;
            this.ele = document.getElementById(this.containerId);
            const actualStyle = styles
            ? (
                styleOverride
                ? styles 
                : KGraph.styles.concat(styles)
            )
            : KGraph.styles;
            this.cy = cytoscape({
                container: document.getElementById(this.containerId),
                style: actualStyle,
                layout: {
                    name: options.layout ?? 'grid',
                },
                pixelRatio: 'auto',
                wheelSensitivity,
                elements: initData?.map(ele => {
                    return ele.groups === 'nodes' ?
                        createNode(ele) :
                        createEdge(ele);
                }),
                maxZoom,
                minZoom,
                userPanningEnabled,
                userZoomingEnabled,
                autolock,
                hideEdgesOnViewport: hideEdgesOnViewport,
                textureOnViewport: textureOnViewport,
                motionBlur: true,
            });
            zoom && this.cy.zoom(zoom);
            pan && this.cy.pan(pan);
            this.history = new KgHistory(this.cy);
            this.datas = new KGraphDatas(this.cy, this.history);
            this.events = new KGraphEvents(this.cy, this.history, this.datas);
            this.history.events = this.events;
        }
    }
}

export default KGraph;
