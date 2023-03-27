const os = require('os');
const path = require('path');
const { exec } = require('child_process');

const {
	fileExists,
	readFile,
	writeFile,
	copyFile,
	createFolder,
} = require('../helpers/file');

const build = require('../helpers/plugin/build');
const runDoctorPlugin = require('./doctorPlugin');
const { error, warning, success, info } = require('../helpers/print');

const mainEntryPoint = 'dist/src/index.js';

const pluginStubFiles = {
	instance: [
		{
			dir: 'src',
			source:
				'node_modules/@gluestack-v2/framework-cli/build/types/plugin/stubs/GlueStackPlugin.ts.txt',
			target: 'src/index.ts',
		},
		{
			dir: 'src',
			source:
				'node_modules/@gluestack-v2/framework-cli/build/types/plugin/stubs/PluginInstance.ts.txt',
			target: 'src/PluginInstance.ts',
		},
	],
	container: [
		{
			dir: 'src',
			source:
				'node_modules/@gluestack-v2/framework-cli/build/types/plugin/stubs/GlueStackPlugin.ts.txt',
			target: 'src/index.ts',
		},
		{
			dir: 'src',
			source:
				'node_modules/@gluestack-v2/framework-cli/build/types/plugin/stubs/PluginInstanceWithContainerController.ts.txt',
			target: 'src/PluginInstance.ts',
		},
		{
			dir: 'src',
			source:
				'node_modules/@gluestack-v2/framework-cli/build/types/plugin/stubs/PluginInstanceContainerController.ts.txt',
			target: 'src/PluginInstanceContainerController.ts',
		},
	],
};

async function getAndValidatePackageJson(filepath) {
	if (!fileExists(filepath)) {
		error('Plugin init command failed: package.json does not exists');
		process.exit(0);
	}
	const packageJson = require(filepath);
	if (!packageJson) {
		error('Plugin init command failed: package.json does not exists');
		process.exit(0);
	}
	return packageJson;
}

async function writeToPackageJson(filepath, packageJson) {
	if (packageJson.main) {
		if (packageJson.main === mainEntryPoint) {
			warning('Plugin init command failed: already a plugin');
			process.exit(0);
		}

		error(
			'Writing to package.json failed: plugin entry point already exists'
		);
		process.exit(0);
	}

	const json = await readFile(filepath);
	json.main = mainEntryPoint;
	json.scripts = {
		...json.scripts,
		'plugin-dev': 'tsc --watch',
		'plugin-build': 'tsc --declaration',
	};

	await writeFile(filepath, JSON.stringify(json, null, 2) + os.EOL);
	return json.name;
}

async function copyPluginFiles(currentDir, type) {
	if (pluginStubFiles[type]) {
		for (const stubFile of pluginStubFiles[type]) {
			if (stubFile.dir) {
				if (!(await fileExists(stubFile.dir))) {
					await createFolder(stubFile.dir);
				}
			}
			await copyFile(
				`${currentDir}/${stubFile.source}`,
				`${currentDir}/${stubFile.target}`
			);
		}
	}
}

async function createTemplateFolder(currentDir, packageJson) {
	await createFolder(`${currentDir}/template`);
	await writeFile(
		`${currentDir}/template/README.md`,
		packageJson.name
	);
}

module.exports = async (app, pluginName, type) => {
	await runDoctorPlugin();
	const currentDir = path.join(process.cwd(), 'packages', pluginName);

	// creating plugin directory
	await createFolder(currentDir);
	await writeFile(path.join(currentDir, 'package.json', '{}'));

	const filepath = currentDir + '/package.json';

	const packageJson = await getAndValidatePackageJson(filepath);
	await writeToPackageJson(filepath, packageJson);
	await build(currentDir);
	await copyPluginFiles(currentDir, type);
	await createTemplateFolder(currentDir, packageJson);
	await new Promise((resolve, reject) => {
		exec('npm install @types/node', async (error, stdout, stderr) => {
			if (error) {
				reject(error);
				return;
			}
			info(stdout);
			exec(
				'npm install typescript --save-dev',
				async (error, stdout, stderr) => {
					if (error) {
						reject(error);
						return;
					}
					info(stdout);
					exec(
						'npm install --save-peer @gluestack-v2/framework-cli',
						async (error, stdout, stderr) => {
							if (error) {
								reject(error);
								return;
							}
							info(stdout);
							resolve(true);
						}
					);
				}
			);
		});
	});

	success(
		`Successfully initialized ${packageJson.name} as a plugin \n`
	);
};
