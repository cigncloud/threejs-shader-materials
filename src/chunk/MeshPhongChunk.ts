import { GLSLChunk } from "./GLSLChunk";

export class MeshPhongChunk extends GLSLChunk {
  public static add(): void {
    MeshPhongUniformChunk.add();
    MeshPhongDiffuseColorChunk.add();
    MeshPhongSwitchingAlphaMapChunk.add();
    MeshPositionVaryingChunk.add();
    MeshPositionVertexChunk.add();
  }

  public static getDefines(): Object {
    return {
      USE_MESH_POSITION: false
    };
  }
}

class MeshPhongUniformChunk extends GLSLChunk {
  protected static getChunkName(): string {
    return "mesh_phong_uniform";
  }

  protected static getChunk(): string {
    return `
      uniform vec3 diffuse;
      uniform vec3 emissive;
      uniform vec3 specular;
      uniform float shininess;
      uniform float opacity;
      uniform bool hasAlphaMap;
      uniform sampler2D alphaMap;
    `;
  }
}

class MeshPhongDiffuseColorChunk extends GLSLChunk {
  protected static getChunkName(): string {
    return "mesh_phong_diffuse_color";
  }

  protected static getChunk(): string {
    return `
      vec4 diffuseColor = vec4( diffuse, opacity );
      ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
      vec3 totalEmissiveRadiance = emissive;
    `;
  }
}

class MeshPhongSwitchingAlphaMapChunk extends GLSLChunk {
  protected static getChunkName(): string {
    return "mesh_phong_switching_alpha_map";
  }

  protected static getChunk(): string {
    return `
      if( hasAlphaMap ){
        diffuseColor.a *= texture2D( alphaMap, uvPosition ).g;
      }
    `;
  }
}

class MeshPositionVaryingChunk extends GLSLChunk {
  protected static getChunkName(): string {
    return "mesh_position_varying";
  }

  protected static getChunk(): string {
    return `
    #ifdef USE_MESH_POSITION
    varying vec3 meshPosition;
    #endif
    `;
  }
}

class MeshPositionVertexChunk extends GLSLChunk {
  protected static getChunkName(): string {
    return "mesh_position_vertex";
  }

  protected static getChunk(): string {
    return `
    #ifdef USE_MESH_POSITION
    meshPosition = position;
    #endif
    `;
  }
}
