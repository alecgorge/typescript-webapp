declare module "snabbdom/modules/class" {
	export default Object;
}
declare module "snabbdom/modules/attributes" {
	export default Object;
}
declare module "snabbdom/modules/props" {
	export default Object;
}
declare module "snabbdom/modules/style" {
	export default Object;
}
declare module "snabbdom/modules/eventlisteners" {
	export default Object;
}

declare module "snabbdom" {
	export interface VNode {
		sel?: string;
		data?: any;
		children?: Array<VNode | string>;
		text?: string;
		key?: any;
		elm?: Element;
	}

	export interface PatchFunction {
		(oldVNode: VNode, vnode: VNode): VNode;
	}

	export function init(modules: Object, api?: Object): PatchFunction;
}

declare module "snabbdom-jsx" {
	import {VNode} from 'snabbdom';
	function html(tag: any, attrs: any, children: any) : VNode;
}

declare module "route-matcher" {
	export interface RouteMatcher {
		parse(route: string) : { [key: string]: string };
		stringify(params: Object) : string;
	}

	export function routeMatcher(route: string | RegExp, validation?: { [key: string]: any }): RouteMatcher; 
}
