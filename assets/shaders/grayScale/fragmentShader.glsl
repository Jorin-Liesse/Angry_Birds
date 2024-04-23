precision mediump float;
varying vec2 v_texCoord;
uniform sampler2D u_texture;

void main() {
  vec4 texColor = texture2D(u_texture, vec2(v_texCoord.x, 1.0 - v_texCoord.y));
  float gray = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
  gl_FragColor = vec4(gray, gray, gray, texColor.a);
}
