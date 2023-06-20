uniform sampler2D noise;
uniform float u_time;
uniform vec2 resolution;

float rand(float st) {
    st = floor(st);
    vec2 co = vec2(floor(st * .3241), fract(st * .3241));
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

vec2 hash( vec2 p ) // replace this by something better
{
	p = vec2( dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)) );
	return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}


float tex_rand(float st) {
    st = mod(st, 4096.);
    float row = floor(st / 64.);
    float col = fract(st / 64.);
    vec2 texel_coord = vec2(row, col);
    return texture2D(noise, texel_coord).x;
}

vec4 tex_rand_twoD(vec2 st) {
    st = vec2(mod(st.x, 64.), mod(st.y, 64.));
    return texture2D(noise, st);
}

float One_D_Perlin(float x) {
    return mix(tex_rand(x), tex_rand(x + 1.), smoothstep(0.0, 1.0, fract(x))) - 0.5;
}

/* float TwoD_Perlin(vec2 st) {
    return mix(tex_rand_twoD(st), tex_rand_twoD(st + vec2(1.0, 0.0)), smoothstep(0.0, 1.0, fract(st.x))) - 0.5;
} */

float One_D_Perlin_Oct(float x, int octaves) {
    float value = 0.0;
    float random_offset = 0.0;
    for(int i = 0; i < octaves; i++) {
        random_offset = tex_rand(float(i) * 2345.);
        value += One_D_Perlin((x + 987. * random_offset) * float(i + 1)) / float(2 * i + 1);
    }
    return value;
}

float simplex_noise(in vec2 p) {
    const float K1 = 0.366025404; // (sqrt(3)-1)/2;
    const float K2 = 0.211324865; // (3-sqrt(3))/6;

    vec2 i = floor(p + (p.x + p.y) * K1);
    vec2 a = p - i + (i.x + i.y) * K2;
    float m = step(a.y, a.x);
    vec2 o = vec2(m, 1.0 - m);
    vec2 b = a - o + K2;
    vec2 c = a - 1.0 + 2.0 * K2;
    vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
    vec3 n = h * h * h * h * vec3(dot(a, hash(i + 0.0).rg), 
                                  dot(b, hash(i + o).rg), 
                                  dot(c, hash(i + 1.0).rg));
    return dot(n, vec3(70.0));
}

float simplex_noise_oct(vec2 p, int octaves) {
    float value = 0.0;
    vec2 random_offset;
    for(int i = 0; i < octaves; i++) {
        random_offset = vec2(
            tex_rand(float(i)),
            tex_rand(float(i+1))
            );
        value += simplex_noise((p + random_offset) * float(i + 1)) / float(i + 1);
    }
    return value;
}



// All components are in the range [0…1], including hue.
vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

// All components are in the range [0…1], including hue.
vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}



float multifloor(float x, float levels) {
    return floor(levels * x)/levels;
}



void main() {
    //vec2 fragcoord = (gl_FragCoord.xy - resolution * 0.5) / (0.5 * resolution.x);
    vec2 fragcoord = gl_FragCoord.xy/resolution.y;

    vec2 scale = vec2(1.0,6.0);
    vec2 offset = vec2(0.0,4.0);

    fragcoord = scale*fragcoord-offset;

    vec3 colorA = vec3(1.0f, 0.85f, 0.68f);
    vec3 colorB = vec3(0.75f, 0.39f, 0.67f);


    vec2 time_offset = vec2(-0.1*u_time,-0.01*u_time);
    vec2 sample_coord = vec2(fragcoord.x,multifloor(fragcoord.y+0.5,1.2));
    float pct = multifloor((fragcoord.y + 0.3 * simplex_noise_oct((time_offset + sample_coord)*3.,20)),1.2);
    vec3 color = mix(colorB,colorA,pct);

    gl_FragColor = vec4(color, 1.0);
}
