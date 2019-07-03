import * as dat from "dat.gui";
import { Common } from "./Common";
import {
  Color,
  Fog,
  Material,
  Mesh,
  PointLight,
  PointLightHelper,
  SphereGeometry,
  TextureLoader
} from "three";
import { Directions } from "../bin/chunk/WavyAnimationChunk";
import { SquareGridMaterial } from "../bin/squareGrid/SquareGridMaterial";

export class StudySquareGrid {
  constructor() {
    const W = 640;
    const H = 480;

    const scene = Common.initScene();
    scene.fog = new Fog(0x000000, 80, 160);
    Common.initLight(scene);
    const camera = Common.initCamera(scene, W, H);
    const renderer = Common.initRenderer(W, H);
    const control = Common.initControl(camera, renderer);
    Common.initHelper(scene);
    const mat = this.initObject(scene);
    Common.render(control, renderer, scene, camera, () => {
      mat.addTime(0.0333);
    });

    this.initGUI(mat);
  }

  initObject(scene) {
    const spot = new PointLight(0xffffff, 1, 0, 2);
    spot.position.set(10, 20, 30);
    scene.add(spot);
    const helper = new PointLightHelper(spot);
    scene.add(helper);

    const geo = new SphereGeometry(10, 64, 64);

    const mat = new SquareGridMaterial({
      // side:DoubleSide,
      fog: scene.fog !== undefined
    });
    mat.color = new Color(0xff6666);
    mat.direction = Directions.vertical;
    const mesh = new Mesh(geo, mat);
    scene.add(mesh);

    return mat;
  }

  initGUI(mat) {
    const gui = new dat.GUI();
    Common.initWavyMaterialGUI(gui, mat);
    this.initGUIMaterial(gui, mat);
  }

  initGUIMaterial(gui, mat) {
    const folder = gui.addFolder("SquareGrid");
    folder.add(mat, "gridWeight", 0.0, 0.5);
    folder.open();
  }
}

window.onload = () => {
  const study = new StudySquareGrid();
};
