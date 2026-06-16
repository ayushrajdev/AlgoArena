import { CosmosClient } from '@azure/cosmos';

const endpoint = process.env.ENDPOINT;
const key = process.env.KEY;
const client = new CosmosClient({ endpoint, key });

const { database } = await client.databases.createIfNotExists({
    id: 'Test Database',
});

const { container } = await database.containers.createIfNotExists({
    id: 'Test Container',
});

export async function addToCosmos({ level, message }) {
    try {
        await container.items.create({
            level,
            message,
            timeStamp:new Date()
        });
    } catch (error) {}
}
