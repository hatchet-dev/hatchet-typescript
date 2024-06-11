import HatchetError from '@util/errors/hatchet-error';
import { createHmac } from 'crypto';
import { IncomingMessage, ServerResponse } from 'http';
import { ActionObject } from '@clients/dispatcher/action-listener';
import { Worker } from './worker';

export interface HandlerOpts {
  secret: string;
}

export class WebhookHandler {
  // eslint-disable-next-line no-useless-constructor,no-empty-function
  constructor(private worker: Worker) {}

  /**
   * Handles a request with a provided body, secret, and signature.
   *
   * @param {string | undefined} body - The body of the request.
   * @param {string | undefined} secret - The secret used for signature verification.
   * @param {string | string[] | undefined | null} signature - The signature of the request.
   *
   * @throws {HatchetError} - If no signature is provided or the signature is not a string.
   * @throws {HatchetError} - If no secret is provided.
   * @throws {HatchetError} - If no body is provided.
   */
  async handle(
    body: string | undefined,
    secret: string | undefined,
    signature: string | string[] | undefined | null
  ) {
    if (!signature || typeof signature !== 'string') {
      throw new HatchetError('No signature provided');
    }
    if (!secret) {
      throw new HatchetError('No secret provided');
    }
    if (!body) {
      throw new HatchetError('No body provided');
    }

    // verify hmac signature
    const actualSignature = createHmac('sha256', secret).update(body).digest('hex');
    if (actualSignature !== signature) {
      throw new HatchetError(`Invalid signature, expected ${actualSignature}, got ${signature}`);
    }

    const action = ActionObject.parse(JSON.parse(body));

    await this.worker.handleAction(action);
  }

  private getHealthcheckResponse() {
    return {
      actions: Object.keys(this.worker.action_registry),
    };
  }

  /**
   * Express Handler
   *
   * This method is an asynchronous function that returns an Express middleware handler.
   * The handler function is responsible for handling incoming requests and invoking the
   * corresponding logic based on the provided secret.
   *
   * @param {string} secret - The secret key used to authenticate and authorize the incoming requests.
   *
   * @return {Function} - An Express middleware handler function that receives the request and response objects.
   */
  expressHandler({ secret }: HandlerOpts) {
    return (req: any, res: any) => {
      this.handle(req.body, req.headers['x-hatchet-signature'], secret)
        .then(() => {
          res.sendStatus(200);
        })
        .catch((e) => {
          res.sendStatus(500);
          this.worker.logger.error(`Error handling request: ${e.message}`);
        });
    };
  }

  /**
   * A method that returns an HTTP request handler.
   *
   * @param {string} secret - The secret key used for verification.
   *
   * @returns {function} - An HTTP request handler function.
   */
  httpHandler({ secret }: HandlerOpts) {
    return (req: IncomingMessage, res: ServerResponse) => {
      const handle = async () => {
        if (req.method === 'GET') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.write(JSON.stringify(this.getHealthcheckResponse()));
          res.end();
          return;
        }

        if (req.method !== 'POST') {
          res.writeHead(405, { 'Content-Type': 'application/json' });
          res.write(JSON.stringify({ error: 'Method not allowed' }));
          res.end();
          return;
        }

        const body = await this.getBody(req);

        await this.handle(body, secret, req.headers['x-hatchet-signature'] as any);

        res.writeHead(200, 'OK');
        res.end();
      };

      handle().catch((e) => {
        this.worker.logger.error(`Error handling request: ${e.message}`);
        res.writeHead(500, 'Internal server error');
        res.end();
      });
    };
  }

  /**
   * A method that returns a Next.js request handler.
   *
   * @param {any} req - The request object received from Next.js.
   * @param {string} secret - The secret key used to verify the request.
   * @return {Promise<Response>} - A Promise that resolves with a Response object.
   */
  nextJSHandler({ secret }: HandlerOpts) {
    const healthcheck = async () => {
      return new Response(JSON.stringify(this.getHealthcheckResponse()), { status: 200 });
    };
    const f = async (req: Request) => {
      await this.handle(await req.text(), secret, req.headers.get('x-hatchet-signature'));
      return new Response('ok', { status: 200 });
    };
    return {
      GET: healthcheck,
      POST: f,
      PUT: f,
    };
  }

  private getBody(req: IncomingMessage): Promise<string> {
    return new Promise((resolve) => {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });
      req.on('end', () => {
        resolve(body);
      });
    });
  }
}
