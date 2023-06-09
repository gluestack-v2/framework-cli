import AppCLI from '../helpers/lib/app';

import IPlugin from './plugin/interface/IPlugin';
import IInstance from './plugin/interface/IInstance';
import IGluePluginStore from './store/interface/IGluePluginStore';

export default abstract class BaseGluestackPlugin implements IPlugin {
	app: AppCLI;
	instances: IInstance[];
	type: 'stateless' | 'stateful' | 'devonly' = 'stateless';
	gluePluginStore: IGluePluginStore;

	constructor(app: AppCLI, gluePluginStore: IGluePluginStore) {
		this.app = app;
		this.instances = [];
		this.type = 'stateless';
		this.gluePluginStore = gluePluginStore;
	}

	abstract init(): void;
	abstract destroy(): void;
	abstract getVersion(): string;
	abstract getName(): string;
	abstract runPostInstall(instanceName: string, target: string): void;
	abstract createInstance(
		key: string,
		gluePluginStore: IGluePluginStore,
		installationPath: string
	): IInstance;

	getType(): 'stateless' | 'stateful' | 'devonly' {
		return this.type;
	}

	getTemplateFolderPath(): string {
		return `${process.cwd()}/node_modules/${this.getName()}/template`;
	}

	getInstallationPath(target: string): string {
		return `./${target}`;
	}

	getInstances(): IInstance[] {
		return this.instances;
	}
}
