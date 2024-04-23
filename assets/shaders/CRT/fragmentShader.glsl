precision mediump float;
uniform vec2 uResolution;
varying vec2 v_texCoord;
uniform sampler2D u_mainCanvas;
uniform sampler2D u_scanlines;
uniform sampler2D u_noise;
uniform sampler2D u_vignette;

uniform float random;
uniform float time;

float gamma = 0.8;
float colorBleed = 0.1;
float desaturation = 0.5;
float bendFactor = 0.15;

vec2 crtCoords(vec2 uv)
{
  uv -= 0.5; // move from 0 to 1,  to -0.5 to 0.5 space
  uv *= 2.0; // move from -0.5 to 0.5, to -1 to 1 space

  uv.x *= 1.0 + pow(abs(uv.y) * bendFactor, 2.0);
  uv.y *= 1.0 + pow(abs(uv.x) * bendFactor, 2.0);

  uv /= 2.0; // move back to -0.5 to 0.5 space
  return uv + 0.5; // move back to 0 to 1 space
}

void main() {
  // vec2 uv = v_texCoord;
  vec2 crtUV = crtCoords(v_texCoord);

  vec4 texColorVignette = texture2D(u_vignette, v_texCoord);
  vec4 texColorScanlines = texture2D(u_scanlines, vec2(crtUV.x + random, crtUV.y + random));
  vec4 texColorNoise = texture2D(u_noise, vec2(crtUV.x / 2.0, crtUV.y / 2.0 - time));
  vec4 texColorMainCanvas = texture2D(u_mainCanvas, crtUV);

  // Partial desaturation effect
  float gray = dot(texColorMainCanvas.rgb, vec3(0.299, 0.587, 0.114));
  texColorMainCanvas.rgb = mix(texColorMainCanvas.rgb, vec3(gray), desaturation);

  // Add some color bleeding
  texColorMainCanvas.rgb += texture2D(u_mainCanvas, crtUV + vec2(0.001, 0.001)).rgb * colorBleed;
  texColorMainCanvas.rgb += texture2D(u_mainCanvas, crtUV + vec2(-0.001, 0.001)).rgb * colorBleed;

  // Gamma correction
  texColorMainCanvas.r = pow(texColorMainCanvas.r, 1.0 / gamma);
  texColorMainCanvas.g = pow(texColorMainCanvas.g, 1.0 / gamma);
  texColorMainCanvas.b = pow(texColorMainCanvas.b, 1.0 / gamma);

  // Add some fading corners
  texColorMainCanvas = texColorMainCanvas * texColorVignette;

  // Add some scanlines and noise
  texColorNoise = mix(texColorNoise, texColorScanlines, 0.3);
  texColorMainCanvas = mix(texColorMainCanvas, texColorNoise, 0.05);

  gl_FragColor = texColorMainCanvas;
}
