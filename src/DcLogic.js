import * as t from "three"
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ammoTmp, defaultLights, MoveController, ArrowHelper } from 'dvijcock';
import models from "./models.js";
import { lvl as lvlS, scoreData, winLooseMsg, power as powerS, influence as influenceS} from './store.js';
import {get as storeGet} from 'svelte/store';

export default class{
	constructor(){}
	init(){
		let dc = this.dcWorld;
		let lvl = storeGet(lvlS);
		let score = {
			yourVoters: 0,
			opponentVoters: 0,
		};
		winLooseMsg.set("");

		dc.camera = new t.PerspectiveCamera( 65, 1/*dc will set acpect*/, 0.1, 30000 );
		dc.camera.position.set(20,7,0);
		this.controls = new OrbitControls(dc.camera, dc.renderer.domElement);
		this.controls.enablePan = false;

		let cameraGroup = new t.Group();	
		cameraGroup.add(dc.camera);
		dc.scene.add(cameraGroup);

		dc.scene.add(defaultLights);

		let platSize = 40+40*lvl;
		const platform = new t.Mesh( new t.BoxGeometry(), new t.MeshStandardMaterial({color: 0xa15c03}) );
		platform.scale.set(platSize, 1, platSize);
		platform.dcData = {
			btShape: true,
			mass: 0,
		};
		dc.addObj(platform);

		const voteBox = new t.Mesh( new t.BoxGeometry(), models["Vote Box"].children[0].material );
		voteBox.scale.set(10, 1.2, 10);
		voteBox.dcData = {
			btShape: true,
			mass: 0,
			onCollision(objThree){
				if(!objThree.dcData.side)return;
				if(objThree.dcData.side == "my"){
					score.yourVoters++;
				}else{
					score.opponentVoters++;
					if(lvl == 4)score.opponentVoters++;
				}
				dc.removeObj(objThree);
			},
		};
		dc.addObj(voteBox);
		let sign = models["Vote Box"].clone();
		sign.scale.set(4,4,4);
		sign.position.z = 4;
		dc.scene.add(sign);

		let player = models["Cross Ball"].clone();
		this.player = player;
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
		this.moveController = new MoveController(player, this.controls, 0.5, 4);

		const ring = new t.Mesh(new t.RingGeometry(0.95, 1, 60 ), new t.MeshBasicMaterial({color: 0x0f9633}) );
		ring.position.set(0,1.6,0)
		ring.rotation.x = -Math.PI/2;
		ring.dcData = {
			tickAfterPhysics(delta){
				ring.position.set(player.position.x, 1.2, player.position.z)
			}
		}
		dc.scene.add(ring);
		let power;
		this.unsubscribe1 = powerS.subscribe((value) => {
			ring.scale.set(value, value, value);
			power = value;
		});

		function createVoter(x, z){
			const voter = new t.Mesh( new t.SphereGeometry(), new t.MeshStandardMaterial({color: "grey"}) );
			voter.position.set(x,1.2,z);
			let size = 0.7
			voter.scale.set(size,size,size);
			voter.dcData = {
				btShape: true,
				mass: .1,
				side: "neutral",
				tickAfterPhysics(delta){
					if(this.side == "opponent")return;
					let distance = voter.position.distanceTo(player.position);
					if(distance > power + size)return;
					this.side = "my";
					let velocity = voter.dcData.rbody.getLinearVelocity();
					let velVec = new t.Vector2(velocity.x(), velocity.z());
					if(velVec.length()>3)return;
					voter.material.color.setHex(0xE7008F);
					let pushVec = new t.Vector2(voter.position.x, voter.position.z).normalize().multiplyScalar(-delta*50);
					voter.dcData.rbody.applyCentralForce(ammoTmp.vec(pushVec.x, 0, pushVec.y));
				},
			};
			dc.addObj(voter);
			voter.dcData.rbody.setActivationState(4);
			return voter;
		}
		if(lvl == 0){
			let voter = createVoter(-1, -15);
			this.arrowHelper = new ArrowHelper("Keep voter in your power range ring. Until he reach vote box",
				models.Arrow, player, voter, 4);
		}else{
			for(let i=1; i<lvl*40; i++){
				let x = -platSize/2 + platSize*Math.random();
				let y = -platSize/2 + platSize*Math.random();
				createVoter(x, y);
			}
			this.influenceInterval;
			this.unsubscribe2 = influenceS.subscribe((value) => {
				if(this.influenceInterval)clearInterval(this.influenceInterval);
				this.influenceInterval = setInterval(()=>{
					let found = false;
					dc.scene.traverse((objThree)=>{
						if(!found && !objThree?.dcData?.influenced
							&& (objThree?.dcData?.side == "neutral" || objThree?.dcData?.side == "my")){
							found = true;
							objThree.dcData.side = "my";
							objThree.dcData.influenced = true;
							objThree.material.color.setHex(0xE7008F);
							objThree.dcData.tickAfterPhysics = (delta)=>{
								let velocity = objThree.dcData.rbody.getLinearVelocity();
								let velVec = new t.Vector2(velocity.x(), velocity.z());
								if(velVec.length()>3)return;
								let pushVec = new t.Vector2(objThree.position.x, objThree.position.z)
									.normalize().multiplyScalar(-delta*50);
								objThree.dcData.rbody.applyCentralForce(ammoTmp.vec(pushVec.x, 0, pushVec.y));
							}
						}
					});
				}, value);
			});
			let opponentDelay = [, 5000, 3500, 2000, 1500 ];
			this.opponentInterval = setInterval(()=>{
				let found = false;
				dc.scene.traverse((objThree)=>{
					if(objThree?.dcData?.side == "neutral" && found == false){
						found = true;
						objThree.dcData.side = "opponent";
						objThree.material.color.setHex(0x0c6dc2);
						objThree.dcData.tickAfterPhysics = (delta)=>{
							let velocity = objThree.dcData.rbody.getLinearVelocity();
							let velVec = new t.Vector2(velocity.x(), velocity.z());
							if(velVec.length()>3)return;
							let pushVec = new t.Vector2(objThree.position.x, objThree.position.z)
								.normalize().multiplyScalar(-delta*50);
							objThree.dcData.rbody.applyCentralForce(ammoTmp.vec(pushVec.x, 0, pushVec.y));
						}
					}
				});
			}, opponentDelay[lvl]);
		}
		this.scoreInterval = setInterval(()=>{
			scoreData.set(score);
			let votersLeft = false;
			let forRemove = [];
			dc.scene.traverse((objThree)=>{
				if(objThree?.dcData?.side)votersLeft= true;
				let pos = new t.Vector3();
				objThree.getWorldPosition(pos);
				if(pos.y > -30)return;
				forRemove.push(objThree);
			});
			for(let i=0; i<forRemove.length; i++) {
				if(forRemove[i] == this.player)winLooseMsg.set("You Loose");
				dc.removeObj(forRemove[i]);
			}
			if(votersLeft)return;
			if(score.yourVoters > score.opponentVoters){
				winLooseMsg.set("You Win");
				if(this.arrowHelper)this.arrowHelper.destroy();
			}else{
				winLooseMsg.set("You Loose");
			}
		}, 300);
	}
	destroy(){
		this.controls.dispose()
		if(this.unsubscribe1)this.unsubscribe1();
		if(this.unsubscribe2)this.unsubscribe2();
		clearInterval(this.opponentInterval);
		clearInterval(this.scoreInterval);
		clearInterval(this.influenceInterval);
		if(this.arrowHelper)this.arrowHelper.destroy();
		this.moveController.destroy();
	}
};
