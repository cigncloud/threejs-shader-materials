import { Common } from "./Common";
import * as dat from "dat.gui";
import {
  Color,
  Fog,
  Mesh,
  PointLight,
  PointLightHelper,
  SphereGeometry
} from "three";
import { CommonGUI } from "./CommonGUI";
import { ExpansionDissolveMaterial } from "../bin/expansionDissolve/ExpansionDissolveMaterial";

export class Study {
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
    Common.render(control, renderer, scene, camera);

    this.initGUI(mat);
  }

  initObject(scene) {
    const spot = new PointLight(0xffffff, 1, 0, 2);
    spot.position.set(10, 20, 30);
    scene.add(spot);
    const helper = new PointLightHelper(spot);
    scene.add(helper);

    const seg = 64;
    const geo = new SphereGeometry(30, seg, seg);

    const mat = new ExpansionDissolveMaterial({
      fog: scene.fog !== undefined
    });
    mat.color = new Color(0x334466);
    mat.tiles = 2;
    const mesh = new Mesh(geo, mat);

    scene.add(mesh);

    return mat;
  }

  initGUI(mat) {
    const gui = new dat.GUI();
    CommonGUI.initMaterialGUI(gui, mat);
    CommonGUI.initFBMTilingGUI(gui, mat);
    this.initGUIMaterial(gui, mat);
  }

  initGUIMaterial(gui, mat) {
    const folder = gui.addFolder("Expansion");
    folder.add(mat, "scaleMax", 0.0, 45.0).step(0.1);
    folder.add(mat, "time", 0.0, 0.1).step(0.001);
    folder.add(mat, "progress", 0.0, 1.0).step(0.01);
    // folder.add(mat, "hashLoop", 1.0, 16.0).step(1.0);
    // folder.add(mat, "amp", 0.0, 6.0).step(0.01);
    folder.open();
  }
}

window.onload = () => {
  const study = new Study();
};
