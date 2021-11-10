// create dom element
function e(tag, text, parent, classs = null, id = null) {
	let o = document.createElement(tag)
	o.appendChild(document.createTextNode(text))
	o.id = id
	if (classs != null) {
		for (let c of classs.split(" "))
			o.classList.add(c);
	}
	//o.classList.add(classs)
	parent.appendChild(o)
	return o
}

// get query informations (like team or player research + keywords)
function get_query(params) {
	let vars = {};
	window.location.href.replace(location.hash, '').replace(
		/[?&]+([^=&]+)=?([^&]*)?/gi,
		function (m, key, value) {
			vars[key] = value !== undefined ? value : '';
		}
	);
	return vars;
}