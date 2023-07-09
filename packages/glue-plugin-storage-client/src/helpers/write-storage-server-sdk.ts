import path from 'path';
import { writeFile } from '@gluestack/helpers';
// import fs from 'fs';

export async function writeStorageServerSdk(
  _storageClientInstanceName: any,
  destinationPath: any
) {
  const sdkPath = destinationPath;
  //   const finalString = `
  //   setStorageclient(minioClient) {
  //     this.minioClient = minioClient;
  //   }

  //   getStorageclient() {
  //     return this.minioClient;
  //   }
  // `;

  // console.log(finalString, map);

  // const sdkFileContent = fs
  //   .readFileSync(path.join(__dirname, '..', '..', 'sdk', 'src', 'index.ts'))
  //   .toString();

  // await writeFile(
  //   path.join(sdkPath, 'src', 'index.ts'),
  //   sdkFileContent.replace(
  //     '// **---Functions will be added after this---**',
  //     finalString
  //   )
  // );
  await writeFile(
    path.join(sdkPath, 'src', 'index.ts'),
    `import ServiceProvider from '@gluestack-v2/framework-cli/build/types/ServiceProvider';
    import axios from 'axios';
    import type { Client } from '@types/minio';
    import Minio from 'minio';
    
    export default class SDK extends ServiceProvider {
      minioClient: any;
      constructor() {
        // Initialization code goes here
        super();
        console.log('ServerSDK instance initialized');
        // this.minioClient = new Minio.Client({
        //   endPoint: '127.0.0.1',
        //   port: 10310,
        //   useSSL: false,
        //   accessKey: 'gluestack',
        //   secretKey: 'password',
        // });
      }
      //static functions
      init(): void {
        //
      }
      destroy(): void {
        //
      }
      login() {}
    
      setStorageclient(minioClient: Client) {
        this.minioClient = minioClient;
      }
    
      // getStorageclient() {
      //   return this.minioClient;
      // }
    }
    `
  );

  // await writeFile(
  //   sdkSrcIndex,
  //   sdKData.replace(
  //     "// **---Functions will be added after this---**",
  //     storageClientTemplate(storageClientInstanceName)
  //   )
  // );
}