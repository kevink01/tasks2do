export function compareObjects(obj1: Object, obj2: Object) {
	return JSON.stringify(obj1) === JSON.stringify(obj2);
}
