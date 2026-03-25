import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../apps/api/.env') });

async function main() {
    const NETWORK = (process.env.SUI_NETWORK as 'testnet' | 'mainnet' | 'devnet') ?? 'testnet';

    // 1. Read deployer keypair from environment variable (hex-encoded)
    const hexKey = process.env.GREENPROOF_DEPLOYER_PRIVATE_KEY;
    if (!hexKey) {
        throw new Error('GREENPROOF_DEPLOYER_PRIVATE_KEY env var is not set');
    }
    const keypair = Ed25519Keypair.fromSecretKey(Buffer.from(hexKey, 'hex'));
    const deployerAddress = keypair.getPublicKey().toSuiAddress();
    console.log('Deploying from address:', deployerAddress);

    // 2. Setup SUI testnet client
    const client = new SuiClient({ url: getFullnodeUrl(NETWORK) });

    // 3. Build Move contracts
    console.log('Building Move contracts...');
    const contractPath = path.join(__dirname, '../contracts');
    const buildOutput = execSync(
        `sui move build --dump-bytecode-as-base64 --path ${contractPath}`,
        { encoding: 'utf-8' }
    );
    const { modules, dependencies } = JSON.parse(buildOutput);
    console.log('Build successful.');

    // 4. Publish the package
    console.log('Publishing package to testnet...');
    const publishTx = new TransactionBlock();
    const [upgradeCap] = publishTx.publish({
        modules,
        dependencies,
    });
    publishTx.transferObjects([upgradeCap], publishTx.pure(deployerAddress));

    const publishResult = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: publishTx,
        options: {
            showEffects: true,
            showObjectChanges: true,
        },
    });

    const deployTxHash = publishResult.digest;
    console.log('Publish tx digest:', deployTxHash);

    // 5. Extract packageId and adminCapId from objectChanges
    const objectChanges = publishResult.objectChanges ?? [];

    const publishedChange = objectChanges.find(
        (c) => c.type === 'published'
    );
    if (!publishedChange || publishedChange.type !== 'published') {
        throw new Error('Could not find published package in objectChanges');
    }
    const packageId = publishedChange.packageId;
    console.log('Package ID:', packageId);

    const adminCapChange = objectChanges.find(
        (c) =>
            c.type === 'created' &&
            c.objectType?.includes('GreenproofAdminCap')
    );
    if (!adminCapChange || adminCapChange.type !== 'created') {
        throw new Error('Could not find GreenproofAdminCap in objectChanges');
    }
    const adminCapId = adminCapChange.objectId;
    console.log('AdminCap ID:', adminCapId);

    // 6. Call create_company_token for demo company
    console.log('Creating company token for PT Nusantara Agro Lestari...');
    const tokenTx = new TransactionBlock();
    const [treasuryCap] = tokenTx.moveCall({
        target: `${packageId}::validator_token::create_company_token`,
        arguments: [
            tokenTx.object(adminCapId),
            tokenTx.pure('demo-company-001'),
            tokenTx.pure('PT Nusantara Agro Lestari'),
            tokenTx.pure('PTPN'),
        ],
    });
    tokenTx.transferObjects([treasuryCap], tokenTx.pure(deployerAddress));

    const tokenResult = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tokenTx,
        options: {
            showEffects: true,
            showObjectChanges: true,
        },
    });

    const tokenTxHash = tokenResult.digest;
    console.log('Token tx digest:', tokenTxHash);

    const tokenObjectChanges = tokenResult.objectChanges ?? [];
    const treasuryCapChange = tokenObjectChanges.find(
        (c) =>
            c.type === 'created' &&
            c.objectType?.includes('CompanyTreasuryCap')
    );
    if (!treasuryCapChange || treasuryCapChange.type !== 'created') {
        throw new Error('Could not find CompanyTreasuryCap in objectChanges');
    }
    const treasuryCapId = treasuryCapChange.objectId;
    console.log('TreasuryCap ID:', treasuryCapId);

    // 7. Call create_registry for demo company
    console.log('Creating task registry for demo company...');
    const registryTx = new TransactionBlock();
    const [registry] = registryTx.moveCall({
        target: `${packageId}::task_registry::create_registry`,
        arguments: [
            registryTx.pure('demo-company-001'),
        ],
    });
    registryTx.transferObjects([registry], registryTx.pure(deployerAddress));

    const registryResult = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: registryTx,
        options: {
            showEffects: true,
            showObjectChanges: true,
        },
    });

    const registryTxHash = registryResult.digest;
    console.log('Registry tx digest:', registryTxHash);

    const registryObjectChanges = registryResult.objectChanges ?? [];
    const registryChange = registryObjectChanges.find(
        (c) =>
            c.type === 'created' &&
            c.objectType?.includes('TaskRegistry')
    );
    if (!registryChange || registryChange.type !== 'created') {
        throw new Error('Could not find TaskRegistry in objectChanges');
    }
    const registryId = registryChange.objectId;
    console.log('Registry ID:', registryId);

    // 8. Write deployed.json
    const deployed = {
        network: NETWORK,
        packageId,
        adminCapId,
        deployTxHash,
        demoCompany: {
            id: 'demo-company-001',
            name: 'PT Nusantara Agro Lestari',
            symbol: 'PTPN',
            treasuryCapId,
            registryId,
            tokenTxHash,
            registryTxHash,
        },
    };

    const outputPath = path.join(__dirname, '../contracts/deployed.json');
    fs.writeFileSync(outputPath, JSON.stringify(deployed, null, 2));
    console.log('\ndeployed.json written to:', outputPath);
    console.log(JSON.stringify(deployed, null, 2));
}

main().catch((err) => {
    console.error('Deploy failed:', err);
    process.exit(1);
});
