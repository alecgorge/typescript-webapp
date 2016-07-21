
export class QueryString {
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
