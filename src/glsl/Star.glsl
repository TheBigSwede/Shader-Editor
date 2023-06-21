uniform float u_time;
uniform vec2 resolution;

float PI = 3.1415;


float star(vec2 p, vec2 center) {
    vec2 r = p-center;
    return .1 / pow(1.05+sin(4.*(atan(r.y,r.x)+u_time)),0.4) / pow(length(p-center), 2.);
}

void main() {

    vec2 fragcoord = gl_FragCoord.xy/resolution.xy-vec2(0.5,0.5);

    vec2 scale = vec2(10.0,10.0);
    vec2 offset = vec2(0.0,0.0);

    fragcoord = scale*fragcoord-offset;

    vec3 color = vec3(0.0);

    color += vec3(1.0, 1.0, 1.0) * pow(sin(u_time), 2.) * star(fragcoord,vec2(0.0,0.0));

    gl_FragColor = vec4(color, 1.0);

}