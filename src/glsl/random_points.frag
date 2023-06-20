uniform sampler2D noise;
uniform float u_time;
uniform vec2 resolution;



float tex_rand(float st) {
    st = mod(st, 262144.);
    float row = floor(st / 512.);
    float col = fract(st / 512.);
    vec2 texel_coord = vec2(row, col);
    return texture2D(noise, texel_coord).x;
}

vec4 tex_rand_twoD(vec2 st) {
    vec2 texture_res = vec2(512.,512.);
    float x = mod(fract(st.x),texture_res.x);
    float y = mod(fract(st.y),texture_res.y);

    return texture2D(noise, vec2(x,y));
}




void main() {
    //vec2 fragcoord = (gl_FragCoord.xy - resolution * 0.5) / (0.5 * resolution.x);
    vec2 fragcoord = gl_FragCoord.xy/resolution.y;

    vec2 scale = vec2(10.0,10.0);
    vec2 offset = vec2(0.0,0.0);

    fragcoord = scale*fragcoord-offset;


    int num_points = 100;
    vec2 seed = vec2(0.31414313,0.1234123412312);

    vec3 color = vec3(0.0);

    for (int i=0; i<num_points; i++){
        vec2 random_point = offset+scale*tex_rand_twoD(seed+vec2(.2345*float(i),0.0)).rg;
        float time_offset = 6.28*tex_rand(seed.x+seed.y+.986*float(i));
        color += vec3(1.0,1.0,1.0)*pow(sin(u_time+time_offset),2.)*.0005/pow(length(fragcoord-random_point),2.);
    }

    //color = tex_rand_twoD(fragcoord).rgb;



    gl_FragColor = vec4(color,1.0);

}