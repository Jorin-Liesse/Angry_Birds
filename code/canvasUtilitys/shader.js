const canvas2D = document.getElementById('mainCanvas');
const canvasTexture = document.getElementById('canvas-webgl');
const gl = canvasTexture.getContext('webgl2');

export class Shader {
  static program;

  static init(vertexShaderSource, fragmentShaderSource) {
    this.isLoaded = false;
    // Compile shaders
    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

    // Create shader program
    this.program = gl.createProgram();
    gl.attachShader(this.program, vertexShader);
    gl.attachShader(this.program, fragmentShader);
    gl.linkProgram(this.program);
    gl.useProgram(this.program);

    // Define vertices covering the whole canvas
    const vertices = new Float32Array([
      -1, -1,  // bottom left
      1, -1,   // bottom right
      -1, 1,   // top left
      1, 1     // top right
    ]);

    // Create buffer and bind vertices
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Get attribute location and enable
    const positionAttribLocation = gl.getAttribLocation(this.program, 'a_position');
    gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionAttribLocation);

    this.texture = gl.createTexture();

    this.resize();
  }

  static initExtraTexture(imageSource, textureUnit, uniformName) {
    const image = new Image();
    image.src = imageSource;

    image.onload = () => {
      const texture = gl.createTexture();
      gl.activeTexture(this.textureIndex[textureUnit]);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

      gl.uniform1i(gl.getUniformLocation(this.program, uniformName), textureUnit);
    };
  }

  static update() {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    gl.uniform1i(gl.getUniformLocation(this.program, 'u_mainCanvas'), 0);
  }

  static draw() {
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw the image
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  static resize() {
    canvasTexture.width = canvas2D.width;
    canvasTexture.height = canvas2D.height;

    gl.viewport(0, 0, canvasTexture.width, canvasTexture.height);
  }

  static textureIndex = {
    0: gl.TEXTURE0,
    1: gl.TEXTURE1,
    2: gl.TEXTURE2,
    3: gl.TEXTURE3,
    4: gl.TEXTURE4,
    5: gl.TEXTURE5,
    6: gl.TEXTURE6,
    7: gl.TEXTURE7,
    8: gl.TEXTURE8,
    9: gl.TEXTURE9,
    10: gl.TEXTURE10,
  };
}

function compileShader(type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
      return null;
  }
  return shader;
}

export async function fetchShader(url) {
  const response = await fetch(url);
  const shaderSource = await response.text();
  return shaderSource;
}