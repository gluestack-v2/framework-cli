import events from 'events';
import writer from '../writer';
import watcher from '../watcher';
import { copyFolder } from '../file';
import { injectPluginStore } from '../getStorePath';
import {
	getTopToBottomPluginInstanceTree,
	attachPluginInstance,
} from '../meta/plugin-instances';
import GluePluginStoreFactory from './factory/plugin/GluePluginStoreFactory';

import commander from '../commander';
import commands from '../../commands';

import IPlugin from '../../types/plugin/interface/IPlugin';
import ICommander from '../../types/helpers/interface/ICommander';
import { IWatchCallback } from '../../types/app/interface/IWatcher';
import IGluePluginStore from '../../types/store/interface/IGluePluginStore';
import IProgramCallback from '../../types/helpers/interface/ICommandCallback';
import IGluePluginStoreFactory from '../../types/store/interface/IGluePluginStoreFactory';

type PluginConstructor = new (
	app: AppCLI,
	gluePluginStore?: IGluePluginStore
) => IPlugin;

export default class AppCLI {
	plugins: Array<IPlugin>;
	commander: ICommander;
	eventEmitter: events;
	gluePluginStoreFactory: IGluePluginStoreFactory;

	constructor() {
		this.plugins = [];
		this.commander = commander;
		this.eventEmitter = new events.EventEmitter();
		this.gluePluginStoreFactory =
			new GluePluginStoreFactory() as IGluePluginStoreFactory;
	}

	// @API: addCommand
	addCommand = (runner: IProgramCallback) => {
		this.commander.addCommand(this, runner);
	};

	async populatePlugins(localPlugins: IPlugin[]) {
		const plugins = await getTopToBottomPluginInstanceTree(
			this,
			process.cwd()
		);

		// boot plugins in npm
		let bootedPlugins = plugins.map(({ plugin }) => plugin);

		// boot plugins in local
		let bootedLocalPlugins = localPlugins.map((PluginClass) => {
			const that = this;

			const loadPlugins = (PluginClass: PluginConstructor) => {
				const p = new PluginClass(that);

				return new PluginClass(
					that,
					injectPluginStore(this, p.getName())
				);
			};

			// @ts-ignore
			return loadPlugins(PluginClass);
		});

		let mergedPlugins = bootedPlugins.concat(bootedLocalPlugins);

		// unique installed and local plugins
		mergedPlugins = [
			...new Map(
				mergedPlugins.map((item) => [item.getName(), item])
			).values(),
		];

		this.plugins = mergedPlugins;
	}

	async initPlugins(localPlugins: Array<IPlugin>) {
		await this.populatePlugins(localPlugins);

		for (const plugin of this.plugins) {
			await plugin.init();
		}

		await this.initPluginInstances();
	}

	async destroyPlugins() {
		await this.destroyPluginInstances();
		for (const plugin of this.plugins) {
			await plugin.destroy();
		}
	}

	async initPluginInstances() {
		for (const plugin of this.plugins) {
			for (const instance of plugin.getInstances()) {
				await instance.init();
			}
		}
	}

	async destroyPluginInstances() {
		for (const plugin of this.plugins) {
			for (const instance of plugin.getInstances()) {
				await instance.destroy();
			}
		}
	}

	// @API: doctor
	async doctor() {
		//
	}

	// @API: dispatchEvent
	dispatchEvent(eventName: string, ...args: any) {
		this.eventEmitter.emit(eventName, ...args);
	}

	// @API: addEventListener
	addEventListener(
		eventName: string,
		callback = (...args: any) => {}
	) {
		this.eventEmitter.on(eventName, callback);
	}

	// @API: createPluginInstance
	async createPluginInstance(
		plugin: IPlugin,
		instance: string,
		src: string,
		target: string
	) {
		if (src && target) {
			await copyFolder(src, target);
		}
		return attachPluginInstance(this, plugin, instance, target);
	}

	// @API: getPluginByName
	getPluginByName(pluginName: string) {
		for (const plugin of this.plugins) {
			if (plugin.getName() === pluginName) {
				return plugin;
			}
		}
		return null;
	}

	// @API: getPlugins
	getPlugins() {
		return this.plugins;
	}

	// @API: getContainerTypePluginInstances
	getContainerTypePluginInstances(bottomToTop = false) {
		const instances = [];
		for (const plugin of this.plugins) {
			for (const instance of plugin.getInstances()) {
				if (!instance.isOfTypeInstance) {
					instances.push(instance);
				}
			}
		}
		if (bottomToTop) {
			return instances.reverse();
		}
		return instances;
	}

	// @API: watch
	watch (cwd: string, pattern: string|string[], callback: IWatchCallback): void {
		watcher.watch(
			cwd,
			pattern,
			callback
		);
	}

	// @API: writer
	async write (cwd: string, instanceName: string): Promise<void> {
		console.log({ cwd, instanceName });

		await writer.write(
			cwd,
			instanceName
		);
	}

	// @API: destroy
	async destroy() {
		// destroy all plugins
		await this.destroyPlugins();
		// close commander
		this.commander.destroy();
		// save changes made into all stores
		this.gluePluginStoreFactory.saveAllStores();
	}

	// @API: init
	async init(localPlugins: Array<IPlugin>) {
		// initialise the commander
		this.commander.init();
		// initialise the local commands
		await this.initLocalCommands();
		// initialise all plugins
		await this.initPlugins(localPlugins);
	}

	async initLocalCommands() {
		for (const command of commands()) {
			this.addCommand(command);
		}
	}
}
