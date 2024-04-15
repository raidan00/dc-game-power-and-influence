import * as t from "three"
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ammoTmp, defaultLights, addMoveController } from 'dvijcock';
import models from "./models.js";
import { lvl as tmpLvl} from './store.js';
import {get as storeGet} from 'svelte/store';

export default class{
	constructor(){}
	init(){
		let dc = this.dcWorld;
		let lvl = storeGet(tmpLvl);

		dc.camera = new t.PerspectiveCamera( 65, 1/*dc will set acpect*/, 0.1, 30000 );
		dc.camera.position.set(20,7,0);
		let controls = new OrbitControls(dc.camera, dc.renderer.domElement);
		controls.enablePan = false;

		let cameraGroup = new t.Group();	
		cameraGroup.add(dc.camera);
		dc.scene.add(cameraGroup);

		dc.scene.add(defaultLights);

		let platSize = 50+50*lvl;
		const platform = new t.Mesh( new t.BoxGeometry(), new t.MeshStandardMaterial({color: 0x874a1c}) );
		platform.scale.set(platSize, 1, platSize);
		platform.addDcData({
			mass: 0,
		});
		dc.addObj(platform);

		const voteBox = new t.Mesh( new t.BoxGeometry(), new t.MeshStandardMaterial({color: "grey"}) );
		voteBox.scale.set(10, 1.2, 10);
		voteBox.addDcData({
			mass: 0,
		});
		dc.addObj(voteBox);

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

		if(lvl == 0){
			const voter = new t.Mesh( new t.SphereGeometry(), new t.MeshStandardMaterial({color: "grey"}) );
			voter.position.set(0,1,-14);
			let size = 0.7
			voter.scale.set(size,size,size);
			voter.addDcData({
				mass: .1,
			});
			dc.addObj(voter);
		}
	}
};
