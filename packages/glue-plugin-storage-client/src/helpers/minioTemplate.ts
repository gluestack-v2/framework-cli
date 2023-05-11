export default () => {
  return `
 const Minio = require("minio");
const { MinioPingError, MinioInitializationError } = require("./errors");
const { isString, isUndefined } = require("ramda-adjunct");
const Context = require("../Context.ts");
const ServierSDK = require("../ServerSdk.ts");

/**
 * Service mixin for managing files in a Minio S3 backend
 *
 * @name moleculer-minio
 * @module Service
 */
module.exports = {
	// Service name
	name: "minio",

	// Default settings
	settings: {
		/** @type {String} The Hostname minio is running on and available at. Hostname or IP-Address */
		endPoint: "127.0.0.1",
		/** @type {Number} TCP/IP port number minio is listening on. Default value set to 80 for HTTP and 443 for HTTPs.*/
		port: 10310,
		/** @type {Boolean?} If set to true, https is used instead of http. Default is true.*/
		useSSL: false,
		/** @type {String} The AccessKey to use when connecting to minio */
		accessKey: "gluestack",
		/** @type {String} The SecretKey to use when connecting to minio */
		secretKey: "password",
		/** @type {String?} Set this value to override region cache*/
		// region: undefined,
		// /** @type {String?} Set this value to pass in a custom transport. (Optional)*/
		// transport: undefined,
		// /** @type {String?} Set this value to provide x-amz-security-token (AWS S3 specific). (Optional)*/
		// sessionToken: undefined,
		/** @type {Number?} This service will perform a periodic healthcheck of Minio. Use this setting to configure the inverval in which the healthcheck is performed. Set to '0' to turn healthcheks of */
		minioHealthCheckInterval: 5000,
	},

	methods: {
		/**
		 * Creates and returns a new Minio client
		 *
		 * @methods
		 *
		 * @returns {Client}
		 */
		createMinioClient() {
			return new Minio.Client(
        // Add Minio Client Info here
      );
		},
		/**
		 * Pings the configured minio backend
		 *
		 * @param {number} timeout - Amount of miliseconds to wait for a ping response
		 * @returns {PromiseLike<boolean|MinioPingError>}
		 */
		ping({ timeout = 5000 } = {}) {
			return this.Promise.race([
				this.client.listBuckets().then(() => true),
				this.Promise.delay(timeout).then(() => {
					throw new MinioPingError();
				}),
			]);
		},
	},

	actions: {},

	/**
	 * Service created lifecycle event handler.
	 * Constructs a new minio client entity
	 */
	created() {
		this.client = this.createMinioClient();
		const sdk = ServierSDK.getInstance();
		sdk.minioClient = this.client;
		// const ctx = new Context(this.broker);
		// ctx.setMinioClient(this.client);
	},
	/**
	 * Service started lifecycle event handler. Resolves when:
	 * * ping of S3 backend has been successful
	 * * a healthCheck has been registered, given minioHealthCheckInterval > 0
	 * @returns {PromiseLike<undefined|MinioInitializationError>}
	 */
	started() {
		/* istanbul ignore next */
		// return this.Promise.resolve()
		// 	.then(() => this.ping())
		// 	.then(() => {
		// 		this.settings.minioHealthCheckInterval
		// 			? (this.healthCheckInterval = setInterval(
		// 					() =>
		// 						this.ping().catch((e) =>
		// 							this.logger.error(
		// 								"Minio backend can not be reached",
		// 								e
		// 							)
		// 						),
		// 					this.settings.minioHealthCheckInterval
		// 			  ))
		// 			: undefined;
		// 		return undefined;
		// 	})
		// 	.catch((e) => {
		// 		throw new MinioInitializationError(e.message);
		// 	});
	},
	/**
	 * Service stopped lifecycle event handler.
	 * Removes the healthCheckInterval
	 */
	stopped() {
		// this.healthCheckInterval && clearInterval(this.healthCheckInterval);
	},
};

 `;
};
