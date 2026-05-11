/**
 * Prisma seed — invoked by Halix installer after `db push` / migrate.
 * Env vars (optional): INSTALL_ADMIN_EMAIL, INSTALL_ADMIN_PASSWORD,
 * INSTALL_PVE_FQDN, INSTALL_PVE_NODE_NAME, INSTALL_PVE_REGION,
 * INSTALL_PVE_REALM, INSTALL_PVE_API_USER, INSTALL_PVE_TOKEN_ID,
 * INSTALL_PVE_TOKEN_SECRET, INSTALL_PVE_VERIFY_TLS
 */
import 'dotenv/config';
import * as argon2 from 'argon2';
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.INSTALL_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.INSTALL_ADMIN_PASSWORD;

  if (email && password) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (!existing) {
      const passwordHash = await argon2.hash(password, { type: argon2.argon2id });
      await prisma.user.create({
        data: {
          email,
          passwordHash,
          role: UserRole.SUPERADMIN,
          firstName: 'Admin',
          lastName: 'User',
          status: 'ACTIVE',
        },
      });
      console.log(`[seed] Created SUPERADMIN user: ${email}`);
    } else {
      console.log(`[seed] Admin user already exists: ${email}`);
    }
  } else {
    console.log('[seed] Skipping admin (set INSTALL_ADMIN_EMAIL + INSTALL_ADMIN_PASSWORD)');
  }

  const fqdn = process.env.INSTALL_PVE_FQDN?.trim();
  const tokenSecret = process.env.INSTALL_PVE_TOKEN_SECRET?.trim();
  if (fqdn && tokenSecret) {
    const name =
      process.env.INSTALL_PVE_NODE_NAME?.trim() || 'Primary Proxmox';
    const tokenId =
      process.env.INSTALL_PVE_TOKEN_ID?.trim() || 'halix-installer';
    const realm = process.env.INSTALL_PVE_REALM?.trim() || 'pam';
    const apiUser =
      process.env.INSTALL_PVE_API_USER?.trim() || `root@${realm}`;
    const verifyTls = process.env.INSTALL_PVE_VERIFY_TLS !== 'false';
    const region = process.env.INSTALL_PVE_REGION?.trim() || null;

    const dup = await prisma.node.findFirst({ where: { fqdn } });
    if (!dup) {
      await prisma.node.create({
        data: {
          name,
          fqdn,
          region,
          proxmoxRealm: realm,
          proxmoxUser: apiUser,
          proxmoxTokenId: tokenId,
          /** Installer stores raw secret; replace with KMS-wrapped ciphertext in production. */
          proxmoxTokenSecretEnc: tokenSecret,
          verifyTls,
        },
      });
      console.log(`[seed] Registered Proxmox node: ${name} (${fqdn})`);
    } else {
      console.log(`[seed] Proxmox node for FQDN already exists: ${fqdn}`);
    }
  } else {
    console.log(
      '[seed] Skipping Proxmox node (set INSTALL_PVE_FQDN + INSTALL_PVE_TOKEN_SECRET)',
    );
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
