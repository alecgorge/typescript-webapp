
import * as UI from './index';
declare var SnabbdomShim: any;

export interface HomeParams {
	verbose?: string;
}

export class HomeViewController extends UI.ViewController<HomeParams> implements UI.IView {
	public constructor(params: HomeParams) {
		super(params);

		this.view = this;
		this.title = "Home";
	}

	private night = true;

	alert() {
		alert("omg");
	}

	getVirtualNode() {
		var p = <p>{this.night}</p>;

		if(this.params.verbose == "1") {
			p = <p on-click={this.alert}>This current setting of night is {this.night}</p>;
		}

		return <div>
			{p}
			<p><a href={router.makeLink(Routes.Test, { "name": "alec"})}>go to test?</a></p>
		</div>;
	}
}

enum Routes {
	Index,
	Home,
	Test
}

let router = new UI.Router(document.getElementById('content'), {
	navigationType: UI.RouterNavigationType.LocationHash
});

router.titleFormatter = (router, vc) => vc.title + " – Test Site";

router.map(Routes.Index, "/", (p: {}) => {
	router.navigateTo('/home', {}, true);
});

router.map(Routes.Home, "/home", (routeParams: HomeParams) => {
	router.replaceCurrentViewController(new HomeViewController(routeParams));
});

router.map(Routes.Test, "/test/:name", (p: { name: string }) => {
	let vc = new UI.ViewController<{ name: string }>(p);
	vc.view = new UI.View(() => <p><a href={router.makeLink<{}>(Routes.Index, {})}>go home {vc.params.name}</a></p>);

	router.replaceCurrentViewController(vc);	
});

router.mapDefault((params: {}) => {
	let vc = new UI.ViewController<Object>(params);
	vc.view = new UI.View(() => <p>Not Found</p>);

	router.replaceCurrentViewController(vc);
});

router.start();
