import * as t from "three"
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ammoTmp, defaultLights, addMoveController } from 'dvijcock';
import models from "./models.js";

export default class{
	constructor(){}
	init(){
		let dc = this.dcWorld;

		dc.camera = new t.PerspectiveCamera( 65, 1/*dc will set acpect*/, 0.1, 30000 );
		dc.camera.position.set(12,7,0);
		let controls = new OrbitControls(dc.camera, dc.renderer.domElement);
		controls.enablePan = false;

		dc.scene.add(defaultLights);

		const platform = new t.Mesh( new t.BoxGeometry(), new t.MeshStandardMaterial({color: 0x13d013}) );
		platform.scale.set(15, 1, 15);
		platform.addDcData({
			mass: 0,
		});
		dc.addObj(platform);

		let sawSize = new t.Vector3(1,0.2,1);
		let model = models["circular saw"].clone();
		var saw = new t.Group();
		saw.add(model);
		saw.scale.set(sawSize.x, sawSize.y, sawSize.z)
		saw.position.set(0,5,0)
		saw.addDcData({
			btShape: new Ammo.btCylinderShape(ammoTmp.vec(sawSize.x, sawSize.y, sawSize.z)),
			mass: 1,
			setFriction: 0.3,
			setRestitution: 0.01,
			tickDispayFps(delta){
				model.rotation.y -= delta*3;
			}
		});
		dc.addObj(saw);
		addMoveController(saw, controls, 0.3, 1.2);
	}
};
