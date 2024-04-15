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


		let ball = models["Cross Ball"].clone();
		ball.position.set(0,5,0)
		ball.addDcData({
			btShape: new Ammo.btSphereShape(1),
			mass: 1,
			tickDispayFps(delta){
				//model.rotation.y -= delta*3;
			}
		});
		dc.addObj(ball);
		addMoveController(ball, controls, 0.5, 3);
	}
};
