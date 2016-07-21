/// <reference path="../typings/index.d.ts" />
/// <reference path="./sab.d.ts" />

import { IView } from './View';
import { Router } from './Router';

export class ViewController<T> {
	public constructor(
		public params: T
		) {
	}

	protected _view: IView = null;
	protected _title: string = null;
	protected _childViewControllers: ViewController<any>[] = [];
	protected parentViewController: ViewController<any> = null;
	protected router: Router = null;

	public get view() {
		return this._view;
	}

	public set view(newView: IView) {
		this._view = newView;
	}

	public get title() {
		return this._title;
	}

	public set title(newTitle: string) {
		this._title = newTitle;
	}

	public get childViewControllers() {
		return this._childViewControllers;
	}

	public viewDidLoad() : void {}
	public viewWillAppear() : void {}
	public viewWillDisappear() : void {}
	public viewDidAppear() : void {}
	public viewDidDisappear() : void {}

	public addChildViewController(child: ViewController<any>) {
		child.willMoveToParentViewController(this);
		this.childViewControllers.push(child);
		child.didMoveToParentViewController(this);
	}

	public removeFromParentViewController() {

	}

	public willMoveToParentViewController(parent: ViewController<any>) {

	}

	public didMoveToParentViewController(parent: ViewController<any>) {
		this.parentViewController = parent;
	}

	public render() {
		this.parentViewController.render();
	}
}
