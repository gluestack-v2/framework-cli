import { join } from 'path';
import { IWriter } from '../types/app/interface/IWriter';
import { createFolder, fileExists, copyFolder } from './file';

class Writer implements IWriter {
	async write (
		path: string,
		instanceName: string
	): Promise<void> {
		const sealPath = join(process.cwd(), '.glue/seal/services');
		if (!fileExists(sealPath)) {
			await createFolder(sealPath);
		}

		const instancePath = join(
			sealPath,
			instanceName,
			'src',
			instanceName
		);
		if (!fileExists(instancePath)) {
			await createFolder(instancePath);
		}

		await copyFolder(path, instancePath);
	}
};

export default new Writer();
