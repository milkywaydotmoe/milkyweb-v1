const vertexShaderSource = `
    attribute vec2 position;
    void main() {
        gl_Position = vec4(position, 0.0, 1.0);
    }
`;

const fragmentShaderSource1Bit = `
    precision mediump float;
    uniform float iTime;
    uniform vec2 iResolution;

    vec2 motionFunction(float i) {
        float t = iTime;

        return vec2(
            (cos(t * .31 + i * 3.) + cos(t * .11 + i * 14.) + cos(t * .78 + i * 30.) + cos(t * .55 + i * 10.)) / 4.,
            (cos(t * .13 + i * 33.) + cos(t * .66 + i * 38.) + cos(t * .42 + i * 83.) + cos(t * .9 + i * 29.)) / 4.
        );
    }

    void mainImage(out vec4 fragColor, in vec2 fragCoord) {
        vec2 uv = fragCoord / iResolution;
        
        float alias = 100. + 40. * motionFunction(7.).x;
        uv = floor(uv * alias) / alias;
        vec2 uv1 = uv + motionFunction(1.);
        vec2 uv2 = uv + motionFunction(2.);
        vec2 uv3 = uv + motionFunction(3.);
        vec3 col1 = .5 + .5 * cos(length(uv1) * 20. + uv1.xyx + vec3(0, 2, 4));
        vec3 col2 = .5 + .5 * cos(length(uv2) * 10. + uv2.xyx + vec3(0, 2, 4));
        vec3 col3 = .5 + .5 * cos(length(uv3) * 10. + uv3.xyx + vec3(0, 2, 4));
        vec3 col = col1 - col2 + col3;

        // Convert to 1-bit grayscale with enhanced pixel art dithering
        float grayValue = dot(col.rgb, vec3(0.2126, 0.7152, 0.0722));
        float ditherValue = mod(floor(gl_FragCoord.x / 2.0) + floor(gl_FragCoord.y / 2.0), 2.0); // Updated for 2x resolution
        float ditheredGrayValue = grayValue + (0.3 * ditherValue); // Increased dithering intensity
        float threshold = 0.5;
        float finalColor = step(threshold, ditheredGrayValue);

        fragColor = vec4(finalColor, finalColor, finalColor, 1.0);
    }

    void main() {
        mainImage(gl_FragColor, gl_FragCoord.xy);
    }
`;

const fragmentShaderSourcePlasma = `
    precision mediump float;
    uniform float iTime;
    uniform vec2 iResolution;

    vec2 motionFunction(float i) {
        float t = iTime;

        return vec2(
            (cos(t * .31 + i * 3.) + cos(t * .11 + i * 14.) + cos(t * .78 + i * 30.) + cos(t * .55 + i * 10.)) / 4.,
            (cos(t * .13 + i * 33.) + cos(t * .66 + i * 38.) + cos(t * .42 + i * 83.) + cos(t * .9 + i * 29.)) / 4.
        );
    }

    void mainImage(out vec4 fragColor, in vec2 fragCoord) {
        vec2 uv = (fragCoord - .5 * iResolution.xy) / iResolution.x;
        
        float alias = 100. + 40. * motionFunction(7.).x;
        uv = floor(uv * alias) / alias;
        vec2 uv1 = uv + motionFunction(1.);
        vec2 uv2 = uv + motionFunction(2.);
        vec2 uv3 = uv + motionFunction(3.);
        vec3 col1 = .5 + .5 * cos(length(uv1) * 20. + uv1.xyx + vec3(0, 2, 4));
        vec3 col2 = .5 + .5 * cos(length(uv2) * 10. + uv2.xyx + vec3(0, 2, 4));
        vec3 col3 = .5 + .5 * cos(length(uv3) * 10. + uv3.xyx + vec3(0, 2, 4));
        vec3 col = col1 - col2 + col3;

        fragColor = vec4(col, 1.);
    }

    void main() {
        mainImage(gl_FragColor, gl_FragCoord.xy);
    }
`;

const canvas = document.getElementById('shaderCanvas');
const gl = canvas.getContext('webgl');

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);

const fragmentShaderPlasma = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShaderPlasma, fragmentShaderSourcePlasma);
gl.compileShader(fragmentShaderPlasma);

const fragmentShader1Bit = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader1Bit, fragmentShaderSource1Bit);
gl.compileShader(fragmentShader1Bit);

const programPlasma = gl.createProgram();
gl.attachShader(programPlasma, vertexShader);
gl.attachShader(programPlasma, fragmentShaderPlasma);
gl.linkProgram(programPlasma);

const program1Bit = gl.createProgram();
gl.attachShader(program1Bit, vertexShader);
gl.attachShader(program1Bit, fragmentShader1Bit);
gl.linkProgram(program1Bit);

const positionAttributeLocationPlasma = gl.getAttribLocation(programPlasma, 'position');
gl.enableVertexAttribArray(positionAttributeLocationPlasma);

const positionAttributeLocation1Bit = gl.getAttribLocation(program1Bit, 'position');
gl.enableVertexAttribArray(positionAttributeLocation1Bit);

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
const positions = [
    -1.0, -1.0,
    1.0, -1.0,
    -1.0, 1.0,
    -1.0, 1.0,
    1.0, -1.0,
    1.0, 1.0,
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

const resolutionUniformLocationPlasma = gl.getUniformLocation(programPlasma, 'iResolution');
const timeUniformLocationPlasma = gl.getUniformLocation(programPlasma, 'iTime');

const resolutionUniformLocation1Bit = gl.getUniformLocation(program1Bit, 'iResolution');
const timeUniformLocation1Bit = gl.getUniformLocation(program1Bit, 'iTime');

let clickCount = 0;
let plasmaVisible = false;

function renderPlasma() {
    const resolution = { width: window.innerWidth, height: window.innerHeight };
    canvas.width = resolution.width;
    canvas.height = resolution.height;

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionAttributeLocationPlasma, 2, gl.FLOAT, false, 0, 0);

    gl.uniform2f(resolutionUniformLocationPlasma, resolution.width, resolution.height);
    gl.uniform1f(timeUniformLocationPlasma, performance.now() / 1000.0);

    gl.useProgram(programPlasma);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function render1Bit() {
    const resolution = { width: window.innerWidth, height: window.innerHeight };
    canvas.width = resolution.width;
    canvas.height = resolution.height;

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionAttributeLocation1Bit, 2, gl.FLOAT, false, 0, 0);

    gl.uniform2f(resolutionUniformLocation1Bit, resolution.width, resolution.height);
    gl.uniform1f(timeUniformLocation1Bit, performance.now() / 1000.0);

    gl.useProgram(program1Bit);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function render() {
    if (plasmaVisible) {
        renderPlasma();
    } else {
        render1Bit();
    }
    requestAnimationFrame(render);
}

render();

const mac = document.getElementById('mac');

mac.addEventListener('click', () => {
    clickCount++;
    if (clickCount % 2 === 0) {
        plasmaVisible = false;
    } else {
        plasmaVisible = true;
    }
});

// Start the background music and make it loop
const backgroundMusic = document.getElementById('backgroundMusic');
backgroundMusic.volume = 0.55; // Set volume to 55%

// Function to start the background music in response to a user interaction
function startBackgroundMusic() {
    backgroundMusic.play();
    backgroundMusic.loop = true;
}

// Add a click event listener to start the background music
document.addEventListener('click', startBackgroundMusic);
