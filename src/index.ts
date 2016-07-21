
import { QueryString } from './QueryString';
import { View, IView } from './View';
import { ViewController } from './ViewController';
import { Router, IRouterOptions, RouterNavigationType } from './Router';
import { html } from 'snabbdom-jsx';

(<any>window).SnabbdomShim = {
	createElement: html
};

export {
    QueryString,
    View,
    IView,
    ViewController,
    Router,
    IRouterOptions,
    RouterNavigationType
}
