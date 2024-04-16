export default function(text, model, from, to, height){

	let arrow = model.clone();
	arrow.dcData = {
		tickAfterPhysics(delta){
			arrow.position.set(from.position.x, height, from.position.z)
			arrow.lookAt(to.position)
		}
	}
	from.parent.add(arrow);
}
