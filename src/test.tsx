/// <reference path="../typings/index.d.ts" />
/// <reference path="./sab.d.ts" />

import { html } from 'snabbdom-jsx';
import * as snabbdom from 'snabbdom';
import { routeMatcher, RouteMatcher } from 'route-matcher';
import * as _ from 'lodash';

export class SnabbdomShim {
	public static createElement = html
}

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

export class ViewController<T> {
	public constructor(
		public params: T
		) {
	}

	protected _view: IView = null;
	protected _title: string = null;
	protected _childViewControllers: ViewController<any>[] = [];
	protected parentViewController: ViewController<any> = null;

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

class RouteHandler<T> {
	public constructor(
		private route: string,
		public handler: (params: T) => void
		) {
		this.matcher = routeMatcher(route);
	}

	private matcher: RouteMatcher = null;

	public match(fullUrl: string) : { [key: string]: string } {
		return this.matcher.parse(fullUrl);
	}
}

import snab_class from 'snabbdom/modules/class';          // makes it easy to toggle classes
import snab_props from 'snabbdom/modules/props';          // for setting properties on DOM elements
import snab_style from 'snabbdom/modules/style';          // handles styling on elements with support for animations
import snab_eventlisteners from 'snabbdom/modules/eventlisteners'; // attaches event listeners
import snab_attrs from 'snabbdom/modules/attributes'; // attaches event listeners

class QueryString {
	public static parse(str: string) : { [key: string]: string } {
		var q: { [key: string]: string } = {};

		if(str) {
			str
				.split('&')
				.map(v => v.split('='))
				.forEach(v => {
					q[decodeURIComponent(v[0])] = decodeURIComponent(v[1]);
				});
		}

		return q;
	}

	public static stringify(obj: { [key: string]: any }) {
		return Object.keys(obj)
			.map(v => encodeURIComponent(v) + "=" + encodeURIComponent(obj[v]))
			.join("&")
			;
	}
}

export interface IRouterOptions {
	base?: string;
}

interface IRouterHistoryEntry {
	route: string;
	params: { [key: string]: string };
} 

export class Router extends ViewController<{}> {
	public constructor(private contentEl: HTMLElement, public options: IRouterOptions = {}) {
		super({});

		if(!options.base) {
			let bases = document.getElementsByTagName('base');

			if(bases.length > 0) {
				options.base = bases[0].getAttribute('href');
			}
			else {
				options.base = '';
			}
		}

		this._domPatch = snabbdom.init([
			snab_class, snab_props, snab_style, snab_eventlisteners, snab_attrs
		]);

		this._virtualNode = contentEl as any as snabbdom.VNode;

		this.bindEvents();
	}

	private bindEvents() {
		window.addEventListener('popstate', (event) => {
			let hist = event.state as IRouterHistoryEntry;

			this.navigateTo(hist.route, hist.params, false);
		});

		this.contentEl.parentNode.addEventListener("click", (e) => {
			if(e.target && (e.target as Element).nodeName == "A") {
				let el = e.target as HTMLAnchorElement;

				let href = el.getAttribute('href');

				// only push state relative urls
				if(!/^([a-z]+:\/\/|\/\/)/i.test(href)) {
					e.preventDefault();
					
					if(href[0] == '/') {
						this.navigateRaw(href);
					}
					else {
						this.navigateRaw(this.options.base + href);
					}
				}
			}
		});
	}

	private _routeHandlers: RouteHandler<any>[] = [];
	private _defaultRouteHandlers: RouteHandler<any> = null;
	private _currentViewController: ViewController<any> = null;

	private _domPatch: snabbdom.PatchFunction;
	private _virtualNode: snabbdom.VNode;

	public map<T>(route: string, handler: (routeParams: T) => void) {
		this._routeHandlers.push(new RouteHandler<T>(route, handler));
	}

	public mapDefault<T>(handler: (routeParams: T) => void) {
		this._defaultRouteHandlers = new RouteHandler<T>(null, handler);
	}

	public start() {
		this.navigateRaw(window.location.pathname + window.location.search, false);
	}

	public navigateRaw(rawPath: string, history: boolean = true) {
		let search = rawPath.split('?');
		let q = QueryString.parse(search[1]);

		let localPath = search[0].substr(Math.max(this.options.base.length - 1, 0));

		this.navigateTo(localPath, q, history);
	}

	public navigateTo(localPathWithoutQueryString: string, params: Object, history: boolean = true) {
		if(history) {
			let search = QueryString.stringify(params);
			let newUrl = this.options.base + localPathWithoutQueryString.substr(1) + (search.length > 0 ? "?" + search : "");

			window.history.pushState({
				route: localPathWithoutQueryString,
				params: params
			} as IRouterHistoryEntry, "", newUrl);
		}

		for (let r of this._routeHandlers) {
			let routeParams = r.match(localPathWithoutQueryString);
			if(routeParams != null) {
				_.merge(routeParams, params);
				r.handler(routeParams);
				return;
			}
		}

		if(this._defaultRouteHandlers) {
			this._defaultRouteHandlers.handler(params);
		}
	}

	public replaceCurrentViewController(viewController: ViewController<any>) {
		this._currentViewController = viewController;
		this.render();
	}

	public get currentViewController() {
		return this._currentViewController;
	}

	public render() {
		this._virtualNode = this._domPatch(this._virtualNode, this.currentViewController.view.getVirtualNode())
	}
}

class TestView implements IView {
	test() {

	}

	rowLinkForValue(val: number) {
		return "http://google.com/?q=" + val;
	}

	getVirtualNode() {
		return (
			<div prop="text" on-click={this.test}>
				<table>
					<tbody>{
						[1,2].map(v => <tr><td><a href={this.rowLinkForValue(v)}>{v}</a></td></tr>)
					}</tbody>
				</table>
			</div>
		);
	}
}
