// db/db.mjs
import { JSONFilePreset } from 'lowdb/node';

export const initDb = async () => {
    const defaultData = { users: [], transactions: [], roles: [], usernames: [] };
    const db = await JSONFilePreset('db.json', defaultData);

    // Initialize roles if they don't exist
    const roles = [
        { name: 'owner', level: 10 },
        { name: 'admin', level: 5 },
        { name: 'leader', level: 4 },
        { name: 'advocate', level: 3 },
        { name: 'member', level: 2 },
        { name: 'user', level: 1 },
    ];

    roles.forEach((role) => {
        if (!db.data.roles.some(r => r.name === role.name)) {
            db.data.roles.push(role);
        }
    });

    await db.write();
    return db;
};
