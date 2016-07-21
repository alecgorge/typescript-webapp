/// <reference path="../typings/index.d.ts" />
/// <reference path="./sab.d.ts" />

import { html } from 'snabbdom-jsx';
import * as snabbdom from 'snabbdom';
import { routeMatcher, RouteMatcher } from 'route-matcher';
import * as _ from 'lodash';

import snab_class from 'snabbdom/modules/class';          // makes it easy to toggle classes
import snab_props from 'snabbdom/modules/props';          // for setting properties on DOM elements
import snab_style from 'snabbdom/modules/style';          // handles styling on elements with support for animations
import snab_eventlisteners from 'snabbdom/modules/eventlisteners'; // attaches event listeners
import snab_attrs from 'snabbdom/modules/attributes'; // attaches event listeners

import { ViewController } from './ViewController';
import { QueryString } from './QueryString';

export enum RouterNavigationType {
    HTML5PushState = 1,
    LocationHash = 2
}

export interface IRouterOptions {
	base?: string;
    navigationType?: RouterNavigationType
}

interface IRouterHistoryEntry {
	route: string;
	params: { [key: string]: string };
}

class RouteHandler<T> {
	public constructor(
		private route: string,
		public handler: (params: T) => void
	) {
		this.matcher = routeMatcher(route);
	}

	public matcher: RouteMatcher = null;

	public match(fullUrl: string): { [key: string]: string } {
		return this.matcher.parse(fullUrl);
	}
}

export class Router extends ViewController<{}> {
	public constructor(private contentEl: HTMLElement, public options: IRouterOptions = {}) {
		super({});

		if (!options.base) {
			let bases = document.getElementsByTagName('base');

			if (bases.length > 0) {
				options.base = bases[0].getAttribute('href');
			}
			else {
				options.base = '';
			}
		}

        if (!options.navigationType) {
            options.navigationType = RouterNavigationType.LocationHash;
			options.base = "#/";
        }

		this._domPatch = snabbdom.init([
			snab_class, snab_props, snab_style, snab_eventlisteners, snab_attrs
		]);

		this._virtualNode = contentEl as any as snabbdom.VNode;

		this.bindEvents();
	}

	private html5events() {
		window.addEventListener('popstate', (event) => {
			let hist = event.state as IRouterHistoryEntry;

			this.navigateTo(hist.route, hist.params, false);
		});

		document.addEventListener("click", (e) => {
			if (e.target && (e.target as Element).nodeName == "A") {
				let el = e.target as HTMLAnchorElement;

				let href = el.getAttribute('href');

				// only push state relative urls
				if (!/^([a-z]+:\/\/|\/\/)/i.test(href)) {
					e.preventDefault();

					if (href[0] == '/') {
						this.navigateRaw(href);
					}
					else {
						this.navigateRaw(this.options.base + href);
					}
				}
			}
		});
	}

	private hashEvents() {
		window.addEventListener('hashchange', (e) => this.onHashChange(), false);
	}

	private onHashChange() {
		let loc = "/" + window.location.hash.replace(/^#\/?|\/$/g, '');

		this.navigateRaw(loc, false);
	}

	private bindEvents() {
		if (this.options.navigationType == RouterNavigationType.HTML5PushState) {
			this.html5events();
		}
		else {
			this.hashEvents();
		}
	}

	private _routeHandlers: RouteHandler<any>[] = [];
	private _routeMapper: { [key: string]: RouteHandler<any> } = {};
	private _defaultRouteHandlers: RouteHandler<any> = null;
	private _currentViewController: ViewController<any> = null;

	private _domPatch: snabbdom.PatchFunction;
	private _virtualNode: snabbdom.VNode;

	public titleFormatter: (router: Router, viewController: ViewController<any>) => string;

	public map<T>(identifier: string | number, route: string, handler: (routeParams: T) => void) {
		let id = identifier + "";
		if (this._routeMapper[id]) {
			throw new Error(`Duplicate route identifier '${id}'`);
		}

		let hdlr = new RouteHandler<T>(route, handler);

		this._routeHandlers.push(hdlr);
		this._routeMapper[id] = hdlr;
	}

	public mapDefault<T>(handler: (routeParams: T) => void) {
		this._defaultRouteHandlers = new RouteHandler<T>(null, handler);
	}

	public start() {
		if (this.options.navigationType == RouterNavigationType.HTML5PushState) {
			this.navigateRaw(window.location.pathname + window.location.search, false);
		}
		else {
			this.onHashChange();
		}
	}

    public makeLink<T extends Object>(routeIdentifier: string | number, params: T) {
		let id = routeIdentifier + "";
		if (!this._routeMapper[id]) {
			throw new Error(`No route with identifier '${id}'`);
		}

		var base = '#/';

		if (this.options.navigationType == RouterNavigationType.HTML5PushState) {
			base = this.options.base;
		}

		return base + this._routeMapper[id].matcher.stringify(params);
	}

	public navigateRaw(rawPath: string, history: boolean = true) {
		let search = rawPath.split('?');
		let q = QueryString.parse(search[1]);

		var localPath = search[0].substr(Math.max(this.options.base.length - 1, 0));

		if (localPath == "") {
			localPath = "/";
		}

		this.navigateTo(localPath, q, history);
	}

	public navigateTo(localPathWithoutQueryString: string, params: Object, history: boolean = true) {
		if (history) {
			let search = QueryString.stringify(params);
			let newUrl = this.options.base + localPathWithoutQueryString.substr(1) + (search.length > 0 ? "?" + search : "");

			if (this.options.navigationType == RouterNavigationType.HTML5PushState) {
				window.history.pushState({
					route: localPathWithoutQueryString,
					params: params
				} as IRouterHistoryEntry, "", newUrl);
			}
			else {
				window.location.hash = newUrl;
			}
		}

		for (let r of this._routeHandlers) {
			let routeParams = r.match(localPathWithoutQueryString);
			if (routeParams != null) {
				_.merge(routeParams, params);
				r.handler(routeParams);
				return;
			}
		}

		if (this._defaultRouteHandlers) {
			this._defaultRouteHandlers.handler(params);
		}
	}

	public replaceCurrentViewController(viewController: ViewController<any>) {
        viewController.willMoveToParentViewController(this);

        let oldVc = this._currentViewController;
        if (oldVc) {
            oldVc.willMoveToParentViewController(null);
        }

		this._currentViewController = viewController;
		this.render();

        viewController.didMoveToParentViewController(this);

        if (oldVc) {
            oldVc.removeFromParentViewController();
        }
	}

	public get currentViewController() {
		return this._currentViewController;
	}

	public render() {
		this.title = this.currentViewController.title;

		if (this.titleFormatter) {
			document.title = this.titleFormatter(this, this.currentViewController);
		}

		this._virtualNode = this._domPatch(this._virtualNode, this.currentViewController.view.getVirtualNode())
	}
}
