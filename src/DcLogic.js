import * as t from "three"
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ammoTmp, defaultLights, MoveController, ArrowHelper } from 'dvijcock';
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
		platform.dcData = {
			btShape: true,
			mass: 0,
		};
		dc.addObj(platform);

		const voteBox = new t.Mesh( new t.BoxGeometry(), new t.MeshStandardMaterial({color: "grey"}) );
		voteBox.scale.set(10, 1.2, 10);
		voteBox.dcData = {
			btShape: true,
			mass: 0,
		};
		dc.addObj(voteBox);

		let player = models["Cross Ball"].clone();
		player.position.set(0,1.6,0)
		player.dcData = {
			btShape: new Ammo.btSphereShape(1),
			mass: 1,
			tickAfterPhysics(delta){
				cameraGroup.position.copy(player.position);	
				dc.camera.lookAt(player.position);
			}
		};
		dc.addObj(player);
		this.moveController = new MoveController(player, controls, 0.5, 3);

		let powerRange = 3;
		const ring = new t.Mesh(new t.RingGeometry(0.9, 1, 30 ), new t.MeshStandardMaterial({color: "green"}) );
		ring.scale.set(powerRange,powerRange,powerRange);
		ring.position.set(0,1.6,0)
		ring.rotation.x = -Math.PI/2;
		ring.dcData = {
			tickAfterPhysics(delta){
				ring.position.set(player.position.x, 1.2, player.position.z)
			}
		}
		dc.scene.add(ring);

		if(lvl == 0){
			const voter = new t.Mesh( new t.SphereGeometry(), new t.MeshStandardMaterial({color: "grey"}) );
			voter.position.set(0,1.2,-14);
			let size = 0.7
			voter.scale.set(size,size,size);
			voter.dcData = {
				btShape: true,
				mass: .1,
			};
			dc.addObj(voter);
			this.arrowHelper = new ArrowHelper("Keep voter in your power range ring. Until he reach vote box",
				models.Arrow, player, voter, 4);
		}
	}
	destroy(){
		if(this.arrowHelper)this.arrowHelper.destroy();
		this.moveController.destroy();
	}
};
