import React from 'react';
import {ArcballControls} from 'three/examples/jsm/controls/ArcballControls';
import * as THREE from 'three';
import {shadeColor} from "./utils";


export const renderCube = (root, width, height, cubeData, renderer, addScene, removeScene) => {

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#fff6ea");
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);

    scene.userData.element = root;
    scene.userData.camera = camera;


    const groups = [];
    const cubeGroup = new THREE.Group();

    let xx = 0, yy = 0, zz = 0, size = 0;

    cubeData.forEach(data => {

        data.coords.forEach(([x, y, z]) => {
            xx += x;
            yy += y;
            zz += z;
            ++size;
        })

    })

    xx /= size;
    yy /= size;
    zz /= size;

    cubeData.forEach(data => {
        const size = 10;
        const item = new THREE.Group();

        data.coords.forEach(([x, y, z]) => {

            const geometry = new THREE.BoxGeometry( size, size, size );
            const material = new THREE.MeshLambertMaterial({
                color: data.color,
            })
            const cube = new THREE.Mesh(geometry, material);
            const edges = new THREE.EdgesGeometry(cube.geometry);

            const lineMaterial = new THREE.LineBasicMaterial({
                color: shadeColor(data.color, -10)
            });

            const line = new THREE.LineSegments(edges,  lineMaterial);

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

    const controls = new ArcballControls(camera, scene.userData.element, scene);
    controls.setGizmosVisible(false);
    controls.enablePan = false;
    controls.enableAnimations = false;
    scene.userData.controls = controls;
    controls.addEventListener('change', function () {
        renderer.render(scene, camera);
    });
    controls.update();

    const ambient = new THREE.AmbientLight( 0xffffff, 0.9 );
    const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.1 );
    camera.add(directionalLight);
    scene.add(camera);
    scene.add(ambient);
    addScene(scene);


    let px = 1;
    let py = 1;
    let animated = false;

    function animate() {
        if (Math.random() < 0.001) px = -px;
        if (Math.random() < 0.001) py = -py;

        cubeGroup.rotateX(0.005 * px);
        cubeGroup.rotateY(0.005 * py)
        if (animated) requestAnimationFrame(animate);
    }

    animate()

    return {
        setVisible: items => {
            groups.forEach((group, num) => {
                group.visible = items.includes(num + 1);
            })
        },
        cancel: () => {
            scene.clear();
            removeScene(scene);
            renderer.clear();
        },
        fire: enable => {
            if (!enable) {
                animated = false;
                return
            }
            animated = true;
            animate();
        }
    }
}


export class Cube extends React.Component {

    constructor(props) {
        super(props);
        this.root = React.createRef();
    }

    componentDidMount() {
        const root = this.root.current;
        const height = this.root.current.clientHeight;
        const width = this.root.current.clientWidth;
        this.cube = renderCube(
            root, width, height, this.props.cubeData,
            this.props.renderer, this.props.addScene, this.props.removeScene
        );
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.cube.setVisible(this.props.items)
        if (prevProps.fired !== this.props.fired) this.cube.fire(this.props.fired)
    }

    componentWillUnmount() {
        this.cube.cancel()
    }

    render() {
        console.log('render')
        return <div ref={this.root} style={{flexGrow: 100, marginTop: -100}}/>;
    }
}