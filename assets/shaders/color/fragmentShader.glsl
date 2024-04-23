precision mediump float;
varying vec2 v_texCoord;
uniform sampler2D u_texture;
void main() {
  gl_FragColor = texture2D(u_texture, vec2(v_texCoord.x, 1.0 - v_texCoord.y));
}
