import * as THREE from 'three';

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

const renderer = new THREE.WebGLRenderer();
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





function animate() {
    requestAnimationFrame(animate);
    uniforms.u_time.value = clock.getElapsedTime();
    renderer.render(scene, camera);
}
animate();





/* async function loadShaders(frag_path, vert_path) {

    // Create a FileLoader instance
    var loader = new THREE.FileLoader();

    // Load the vertex shader file
    await loader.load(
        vert_path,  // URL of the vertex shader file
        function (vertexShaderSource) {

            // Load the fragment shader file
            loader.load(
                frag_path,  // URL of the fragment shader file
                function (fragmentShaderSource) {



                    // ...
                },
                function (xhr) {
                    // Progress callback for fragment shader
                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                },
                function (error) {
                    // Error callback for fragment shader
                    console.error('Failed to load fragment shader:', error);
                }
            );
        },
        function (xhr) {
            // Progress callback for vertex shader
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            // Error callback for vertex shader
            console.error('Failed to load vertex shader:', error);
        }
    );


}

loadShaders('shaders/frag.glsl', 'shaders/vertex.glsl'); */



