import * as t from "three"
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ammoTmp, defaultLights, addMoveController } from 'dvijcock';
import models from "./models.js";

export default class{
	constructor(){}
	init(){
		let dc = this.dcWorld;
		//dc.scene.background = new t.Color("rebeccapurple");

		dc.camera = new t.PerspectiveCamera( 65, 1/*dc will set acpect*/, 0.1, 30000 );
		dc.camera.position.set(20,7,0);
		let controls = new OrbitControls(dc.camera, dc.renderer.domElement);
		controls.enablePan = false;

		let cameraGroup = new t.Group();	
		cameraGroup.add(dc.camera);
		dc.scene.add(cameraGroup);

		dc.scene.add(defaultLights);

		const platform = new t.Mesh( new t.BoxGeometry(), new t.MeshStandardMaterial({color: 0x874a1c}) );
		platform.scale.set(100, 1, 100);
		platform.addDcData({
			mass: 0,
		});
		dc.addObj(platform);


		let ball = models["Cross Ball"].clone();
		ball.position.set(0,5,0)
		ball.addDcData({
			btShape: new Ammo.btSphereShape(1),
			mass: 1,
			tickAfterPhysics(delta){
				cameraGroup.position.copy(ball.position);	
				dc.camera.lookAt(ball.position);
			}
		});
		dc.addObj(ball);
		addMoveController(ball, controls, 0.5, 3);
	}
};
