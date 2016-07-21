/// <reference path="../typings/index.d.ts" />
/// <reference path="./sab.d.ts" />

import * as snabbdom from 'snabbdom';

export interface IView {
	getVirtualNode() : snabbdom.VNode;
}

export class View {
	public constructor(private gen: () => snabbdom.VNode) {

	}

	getVirtualNode() {
		return this.gen();
	}
}
