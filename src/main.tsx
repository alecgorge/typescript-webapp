
import {Router, IView, View, ViewController, SnabbdomShim} from './test';

export interface HomeParams {
	verbose?: string;
}

export class HomeViewController extends ViewController<HomeParams> implements IView {
	public constructor(params: HomeParams) {
		super(params);

		this.view = this;
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
			<p><a href="test/alec">go to test?</a></p>
		</div>;
	}
}

let router = new Router(document.getElementById('content'));

router.map("/", (p: {}) => {
	router.navigateTo('/home', {}, true);
});

router.map("/home", (routeParams: HomeParams) => {
	router.replaceCurrentViewController(new HomeViewController(routeParams));
});

router.map("/test/:name", (p: { name: string }) => {
	let vc = new ViewController<{ name: string }>(p);
	vc.view = new View(() => <p><a href="">go home {vc.params.name}</a></p>);

	router.replaceCurrentViewController(vc);	
});

router.mapDefault((params: {}) => {
	let vc = new ViewController<Object>(params);
	vc.view = new View(() => <p>Not Found</p>);

	router.replaceCurrentViewController(vc);
});

router.start(); //location.pathname.substr("/lib".length) + location.search);
