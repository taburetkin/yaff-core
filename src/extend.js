export function extend(protoProps = {}, staticProps) {

	const Parent = this;

	const hasOwnCtor = Object.hasOwnProperty.call(protoProps, 'constructor');

	const Child = hasOwnCtor
		? protoProps.constructor
		: function() { return Parent.apply(this, arguments); };
	
	Object.assign(Child, Parent, staticProps);
	if (!Child.prototype) {
		Child.prototype = {};
	}
	Object.assign(Child.prototype, protoProps, { super: Parent.prototype });
	Object.setPrototypeOf(Child.prototype, Parent.prototype);
	Child.prototype.constructor = Child;

	return Child;

};