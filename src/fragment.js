import React from 'react';
import * as THREE from 'three';
import {useDispatch, useSelector} from "react-redux";
import {toggleVisible} from "./store";
import {CanvasContext} from "./App";
import {shadeColor} from "./utils";



export const renderCube = (root, width, height, cubeData, renderer, addScene, removeScene) => {

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    scene.userData.element = root;
    scene.userData.camera = camera;

    const groups = [];
    const cubeGroup = new THREE.Group();

    cubeData.forEach(data => {
        const size = 10;
        const item = new THREE.Group();

        let xx = 0, yy = 0, zz = 0;

        data.coords.forEach(([x, y, z]) => {
            xx += x;
            yy += y;
            zz += z;
        })

        xx /= data.coords.length;
        yy /= data.coords.length;
        zz /= data.coords.length;

        data.coords.forEach(([x, y, z]) => {
            const geometry = new THREE.BoxGeometry( size, size, size );
            const material = new THREE.MeshLambertMaterial({
                color: data.color,
            })
            material.baseColor = data.color;
            const cube = new THREE.Mesh(geometry, material);
            const edges = new THREE.EdgesGeometry(cube.geometry);

            const lineMaterial = new THREE.LineBasicMaterial({
                color: shadeColor(data.color, -10)
            });

            const line = new THREE.LineSegments(edges,  lineMaterial);
            lineMaterial.baseColor = shadeColor(data.color, -10);

            line.position.x = cube.position.x = (x - xx) * size;
            line.position.y = cube.position.y = (y - yy) * size;
            line.position.z = cube.position.z = (z - zz) * size;

            item.add(cube);
            item.add(line);
        })
        groups.push(item);
        cubeGroup.add(item)
    });

    scene.add(cubeGroup)
    camera.position.set(0, 0, 80);
    cubeGroup.rotateX(0.6);
    cubeGroup.rotateY(0.8);

    const ambient = new THREE.AmbientLight(0xffffff, 0.9);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.1);
    camera.add(directionalLight);
    scene.add(camera);
    scene.add(ambient);
    addScene(scene);

    return {
        setVisible: () => {
            groups.forEach(group => {
                const disabled = group.children[0].material.color.getHex() === 0xcccccc;
                group.children.forEach(c => c.material.color.set(disabled ? c.material.baseColor : '#cccccc'))
            })
        },
        cancel: () => {
            scene.clear();
            removeScene(scene);
            renderer.clear();
        }
    }
}


export const SmartFragment = props => {
    const item = props.item;
    const dispatch = useDispatch();
    const cubeData = useSelector(state => state.counter.cubeData);
    const disabled = useSelector(state => !state.counter.visibleItems.includes(item));
    const {
        renderer, addScene, removeScene
    } = React.useContext(CanvasContext);
    const onClick = () => {
        dispatch(toggleVisible(item))
    }
    return <Fragment
        cubeData={cubeData}
        renderer={renderer}
        addScene={addScene}
        removeScene={removeScene}
        item={item}
        onClick={onClick}
        disabled={disabled}
    />
}

export class Fragment extends React.Component {

    constructor(props) {
        super(props);
        this.root = React.createRef();
        this.cube = React.createRef();
    }

    componentDidMount() {
        const root = this.root.current;
        const height = this.root.current.clientHeight;
        const width = this.root.current.clientWidth;
        this.cube = renderCube(
            root, width, height, this.props.cubeData.filter(i => i.item === this.props.item),
            this.props.renderer, this.props.addScene, this.props.removeScene
        );
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.disabled !== prevProps.disabled)
            this.cube.setVisible(this.props.items)
    }

    componentWillUnmount() {
        this.cube.cancel()
    }

    render() {
        return <div style={{position: "relative"}} onClick={this.props.onClick}>
            <div className="fragment" ref={this.root} style={{flexGrow: 100}}/>
        </div>
    }
}