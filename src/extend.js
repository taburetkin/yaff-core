
export function extend(protoProps = {}, staticProps) {

	const Parent = this;

	const hasOwnCtor = Object.hasOwnProperty.call(protoProps, 'constructor');

	//let Child;
	// const Child = hasOwnCtor
	// 	? protoProps.constructor
	// 	: createClass(Parent);
	
	const Child = createClass(Parent, hasOwnCtor, protoProps.constructor);

	Object.assign(Child, Parent, staticProps);

	Object.assign(Child.prototype, protoProps, { super: Parent.prototype });
	Object.setPrototypeOf(Child.prototype, Parent.prototype);
	Child.prototype.constructor = Child;

	return Child;

};

function createClass(Parent, hasCtor, Ctor) {
	const isClass = !Object.getOwnPropertyDescriptor(Parent, 'prototype').writable;
	if (isClass) {
		class Child extends Parent {
			constructor(...args) {
				super(...args);
				if (Ctor) {
					Ctor.apply(this, arguments);
				}
			}
		}
		return Child;
	}
	return hasCtor ? Ctor : function() { return Parent.apply(this, arguments); }
}