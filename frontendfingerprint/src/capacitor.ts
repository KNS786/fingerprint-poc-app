import {Plugins} from "@capacitor/core"

const {Camera} = Plugins

export function registerPlugins() {
	Camera.register()
}
