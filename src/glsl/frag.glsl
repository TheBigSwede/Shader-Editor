uniform sampler2D noise;
uniform float u_time;
uniform vec2 resolution;

float PI = 3.1415;
float e = 2.71828182846;

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
        value += simplex_noise((2.5*p + random_offset) * float(i + 1)) / float(i + 1);
    }
    return 0.075*value;
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

float fast_exp(float x) {
    //x = clamp(x,-1.,1.);
    //return pow(1. - 2.*x*x + x*x*x*x,2.);
    return exp(-x*x);
}

float angular(vec2 r, float a, float b, float n) {
    float angle = atan(r.y,r.x);
    return pow((1.+b*sin(n*angle-.5*PI)),a);
}

float star(vec2 p, vec2 center, float time, int points) {
    vec2 r = p-center;
    float R = length(r);
    vec2 offset = vec2(0.01*(1.+sin(time-PI/3.)),0.0);
    float s = sin(PI/2.*float(points));
    float c = cos(PI/2.*float(points));
    mat2 rotation = mat2(s,c,-c,s);

/*     float radial = 100.*(sin(time)+1.)*pow(e,-1000.*(R-.1*sin(time))*(R-.1*sin(time))) + (sin(time+PI*0.7)+1.)/pow(R,1.5);
    float angular = 1./pow(1.001+sin(4.*(atan(r.y,r.x))-.5*PI),0.4);

    return 0.0001*radial*angular; */

    float result = pow((1.+sin(time+2.*PI/4.)),2.0)*fast_exp(250.*R);

/*     for (int i=0; i<points; i++) {
        
        result += pow((0.5*sin(time-PI/3.)+1.),3.)*fast_exp(200.*length(r-offset));
        offset = rotation * offset;
    } */

    float angular = angular(r,-10.*pow((1.+sin(time-0.05*PI))/2.,5.),0.5,4.);

    return pow(atan(angular*result),2.5);

    //return pow(sin(time),2.)*.0001 / pow(1.05+sin(4.*(atan(r.y,r.x))-.5*PI),0.4) / pow(length(r), 2.);
}

vec3 random_points(vec2 coord) {


    int num_points = 50;
    vec2 seed = vec2(0.3149914313,0.1234123412312);

    vec3 color = vec3(0.0);

    vec2 range = vec2(1.0,0.3);

    for (int i=0; i<num_points; i++){
        vec2 random_point = range*tex_rand_twoD(seed+vec2(.2345*float(i),0.0)).rg;
        float time_offset = u_time+6.28*tex_rand(seed.x+seed.y+.986*float(i));        
        color += vec3(1.0,1.0,1.0)*star(coord,random_point,time_offset,4);
    }

    return color;

}

void main() {
    //vec2 fragcoord = (gl_FragCoord.xy - resolution * 0.5) / (0.5 * resolution.x);
    vec2 fragcoord = gl_FragCoord.xy/resolution.xy;

    vec3 colorA = vec3(0.25f, 0.09f, 0.5f);
    vec3 colorB = vec3(0.83f, 0.37f, 0.64f);
    vec3 colorC = vec3(0.99f, 0.47f, 0.51f);
    vec3 colorD = vec3(0.98f, 0.64f, 0.56f);
    vec3 colorE = vec3(1.00f, 0.91f, 0.59f);

    vec3 color;


    vec2 time_offset = vec2(-0.05*u_time,-0.01*u_time);
    vec2 sample_coord = vec2(fragcoord.x,0.0);
    if (fragcoord.y < simplex_noise_oct(sample_coord-time_offset,10)+0.25){
        color = colorA + random_points(fragcoord);
    } else if (fragcoord.y < simplex_noise_oct(sample_coord+time_offset+vec2(1231.,0.341234),10)+0.45) {
        color = colorB;
    } else if (fragcoord.y < simplex_noise_oct(sample_coord-time_offset+vec2(9873.,0.23215234),10)+0.65) {
        color = colorC;
    } else if (fragcoord.y < simplex_noise_oct(sample_coord+time_offset+vec2(328.,0.3214235),10)+0.85) {
        color = colorD;
    } else {
        color = colorE;
    }

    //color = random_points(fragcoord);


    gl_FragColor = vec4(color, 1.0);
}