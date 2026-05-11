import { Injectable } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';

export type ProxmoxNodeTarget = {
  fqdn: string;
  port?: number;
  realm: string;
  user: string;
  tokenId: string;
  tokenSecret: string;
  verifyTls: boolean;
};

/**
 * Builds PVE API token authentication and request paths.
 * Actual HTTP calls should run in workers with rate limits and retries; API delegates jobs to BullMQ.
 */
@Injectable()
export class ProxmoxService {
  baseUrl(node: ProxmoxNodeTarget) {
    const host = node.fqdn.replace(/\/$/, '');
    const port = node.port ?? 8006;
    return `https://${host}:${port}/api2/json`;
  }

  /** Header value: `PVEAPIToken=USER@REALM!TOKENID=SECRET` */
  buildAuthorizationHeader(node: ProxmoxNodeTarget) {
    const user = `${node.user}@${node.realm}`;
    return `PVEAPIToken=${user}!${node.tokenId}=${node.tokenSecret}`;
  }

  /**
   * Proxmox CSRF prevention: POST requires ticket from /access/ticket for cookie auth;
   * API tokens use header only. For SPICE/noVNC ticket flows use ticket endpoint separately.
   */
  computeCsrfToken(seed = randomBytes(16).toString('hex')) {
    return createHash('sha256').update(seed).digest('hex');
  }
}
