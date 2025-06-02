async function get(url) {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`shit ${response.status}`);
		}

		const json = await response.json();
		//console.warn(json);
		return json;
	} catch (error) {
		console.error(`shit ${error}`)
	}
}

window.a123 = get('http://localhost:8080/myplugin/status');
window.a123.then(json => {
	console.log(json.currentScene);
	document.getElementById("scene").innerHTML = json.currentScene;
})
