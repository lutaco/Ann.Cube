import React from 'react';
import './App.css';
import {
    createBrowserRouter, RouterProvider,
} from "react-router-dom";
import {Main} from "./pages/Main";
import {View} from "./pages/View";
import {Provider} from "react-redux";
import {store} from "./store";
import * as THREE from 'three';
import {Constructor} from "./pages/Constructor";


const router = createBrowserRouter([
    {
        path: "/",
        element: <Main />,
    },
    {
        path: "/view",
        element: <View />,
    },
    {
        path: "/constructor",
        element: <Constructor />
    }
]);


const canvas = document.getElementById('root-canvas');
const scenes = [];

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
});

renderer.setClearColor(0x000000, 0)

function updateSize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (canvas.width !== width || canvas.height !== height)
        renderer.setSize( width, height, false );
}


function animate(getScenes) {
    render(getScenes);
    requestAnimationFrame(() => animate(getScenes));
}


renderer.setClearColor(0x000000, 0);
renderer.setScissorTest(true);

function render(getScenes) {

    updateSize();
    renderer.domElement.style.transform = 'translateY(' + window.scrollY + 'px)';
    getScenes().forEach(scene => {
        const element = scene.userData.element;
        const rect = element.getBoundingClientRect();

        const isOffscreen =
            rect.bottom < 0 ||
            rect.top > renderer.domElement.clientHeight ||
            rect.right < 0 ||
            rect.left > renderer.domElement.clientWidth;

        if (isOffscreen) return;

        const width = rect.right - rect.left;
        const height = rect.bottom - rect.top;
        const left = rect.left;
        const bottom = renderer.domElement.clientHeight - rect.bottom;

        renderer.setViewport(left, bottom, width, height);
        renderer.setScissor(left, bottom, width, height);

        const camera = scene.userData.camera;
        renderer.render(scene, camera);

    });

}

const state = {
    renderer,
    scenes
};

window.renderer = renderer;
window.state = state;
animate(() => state.scenes);

export const CanvasContext = React.createContext(null);


const Canvas = props => {
    const actions = {
        renderer: state.renderer,
        addScene: scene => {
            state.scenes = [...state.scenes, scene]
        } ,
        removeScene: scene => {
            state.scenes = state.scenes.filter(sc => sc !== scene)
        }
    };
    return (
        <CanvasContext.Provider className="Provider" value={actions}>
            {props.children}
        </CanvasContext.Provider>
    );
}



function App() {
    return (
        <Provider store={store}>
            <Canvas>
                <RouterProvider router={router} />
            </Canvas>
        </Provider>
    )
}

export default App;
