

void main() {
    vec4 result;


    result = vec4(
        position.x,
        position.y,
        position.z,
        1.0
    );

    gl_Position = projectionMatrix * modelViewMatrix * result;
}