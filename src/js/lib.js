function e(tag, text, parent, classs=null, id=null) {
	let o = document.createElement(tag)
	o.appendChild(document.createTextNode(text))
	o.id = id
	o.classList.add(classs)
	parent.appendChild(o)
	return o
}