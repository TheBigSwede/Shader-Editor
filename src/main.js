import * as THREE from 'three';
import { KeyboardState } from './KeyHandler';


import fragment from '/src/glsl/frag.glsl';
import vertex from '/src/glsl/vert.glsl';
/* import noise from '/src/textures/noise/512_512/LDR_RGBA_0.png'; */

//Load blue noise texture
const textureLoader = new THREE.TextureLoader();
const noise = textureLoader.load('/src/textures/noise/512_512/LDR_RGBA_0.png');
noise.minFilter = THREE.NearestFilter;
noise.magFilter = THREE.NearestFilter;

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(- 1, 1, 1, - 1, -1, 1);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(512, 512);
document.body.appendChild(renderer.domElement);

const clock = new THREE.Clock()

let uniforms = {
    noise: {
        value: noise,
    },
    u_time: {
        type: 'f',
        value: clock.getElapsedTime(),
    },
    resolution: {
        value: renderer.getSize(new THREE.Vector2()),
    },
}

// Create a ShaderMaterial using the loaded shader sources
const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms: uniforms,
    // ... other shader properties
});



// Use the shader material in your Three.js objects

const geometry = new THREE.PlaneGeometry(2, 2);
const fullscreen_plane = new THREE.Mesh(geometry, shaderMaterial);
scene.add(fullscreen_plane);

// Enable keyboard input

function handleKeyPress(event) {
    console.log("Key pressed:", event.key);
    if (event.key === 'p') {
        getImageData = true;
    }
}

// Add an event listener to the document that listens for the 'keypress' event
document.addEventListener("keypress", handleKeyPress);


var getImageData;
var imgData;



function animate() {
    requestAnimationFrame(animate);
    uniforms.u_time.value = clock.getElapsedTime();
    renderer.render(scene, camera);
    if (getImageData == true) {
        imgData = renderer.domElement.toDataURL();
        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'screenshot.png';
        link.click();
        getImageData = false;
    }
}
animate();






