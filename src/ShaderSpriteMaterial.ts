import FragmentShader from "./ShaderSpriteMaterial.frag.glsl";
import VertexShader from "./ShaderSpriteMaterial.vert.glsl";
import { SpriteChunk } from "./chunk/";
import {
  Color,
  Matrix3,
  ShaderMaterial,
  ShaderMaterialParameters,
  Texture,
  UniformsUtils,
  Vector2,
} from "three";

export abstract class ShaderSpriteMaterial extends ShaderMaterial {
  /**
   * コンストラクタ。
   * @param vertexShader
   * @param fragmentShader
   * @param parameters
   */
  constructor(
    vertexShader: string,
    fragmentShader: string,
    parameters?: ShaderMaterialParameters
  ) {
    super(parameters);

    parameters ??= {};
    vertexShader ??= VertexShader();
    fragmentShader ??= FragmentShader();

    this.initChunks();
    this.initUniforms();
    this.initDefines();
    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;
    this.initDefaultSetting(parameters);
  }

  /**
   * ShaderChunkにこのマテリアルに必要なChunkを追加する。
   */
  protected initChunks(): void {
    SpriteChunk.registerChunk();
  }

  /**
   * uniformsを初期化する。
   */
  protected initUniforms(): void {
    this.uniforms = UniformsUtils.merge([SpriteChunk.getUniform(), {}]);
  }

  /**
   * definesを初期化する。
   */
  protected initDefines(): void {
    this.defines = Object.assign({}, SpriteChunk.getDefines(), this.defines);
  }

  /**
   * 1.オプションで指定されなかったパラメーター値を補完する。
   * 2.uniformsに代入する必要のあるパラメーターを明示的に代入する。
   *
   * @param parameters
   */
  protected initDefaultSetting(parameters?: ShaderMaterialParameters): void {
    this.uniformOpacity = this._opacity;
  }

  /**
   * 透明度
   * @deprecated Use uniformOpacity, To be removed in version 0.3.0
   * @see https://github.com/microsoft/TypeScript/pull/37894
   */
  //@ts-ignore : これはopacityプロパティとuniforms.opacityプロパティを同期するために利用されます。
  get opacity(): number {
    return this._opacity;
  }

  /**
   * 透明度
   */
  get uniformOpacity(): number {
    return this._opacity;
  }

  /**
   * 透明度
   * @deprecated Use uniformOpacity, To be removed in version 0.3.0
   * @param value
   */
  //@ts-ignore : これはopacityプロパティとuniforms.opacityプロパティを同期するために利用されます。
  set opacity(value: number) {
    this.uniformOpacity = value;
  }

  /**
   * 透明度
   * opacityは基底クラスのMaterialのコンストラクタ内で明示的に1.0が代入される。
   * この段階でuniformsはundefinedなので、そのままでは初期化できない。
   * このsetterでは受け取った値をprivate変数に保存して、初期化後にuniformsに再代入する。
   * @param value
   */
  set uniformOpacity(value: number) {
    this._opacity = value;
    if (this.uniforms?.opacity) {
      this.uniforms.opacity.value = value;
    }
  }
  protected _opacity: number = 1.0;

  /**
   * Spriteマテリアルと互換性を持つために、colorプロパティはdiffuseへ代入される。
   */
  get color(): Color {
    return this.uniforms.diffuse.value;
  }
  set color(value: Color) {
    this.uniforms.diffuse.value = value;
  }

  get center(): Vector2 {
    return this.uniforms.center.value;
  }
  set center(value: Vector2) {
    this.uniforms.center.value = value;
  }

  get rotation(): number {
    return this.uniforms.rotation.value;
  }
  set rotation(value: number) {
    this.uniforms.rotation.value = value;
  }

  get uvTransform(): Matrix3 {
    return this.uniforms.uvTransform.value;
  }
  set uvTransform(value: Matrix3) {
    this.uniforms.uvTransform.value = value;
  }

  get map(): Texture {
    return this.uniforms.map.value;
  }
  set map(value: Texture) {
    this.uniforms.map.value = value;
  }
}
