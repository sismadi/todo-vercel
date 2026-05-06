// api/todos.js
import { db } from '@vercel/postgres';

export default async function handler(req, res) {
  const client = await db.connect();

  try {
    // 1. Create Table if not exists
    await client.sql`CREATE TABLE IF NOT EXISTS todos (id SERIAL PRIMARY KEY, task TEXT, done BOOLEAN DEFAULT FALSE);`;

    if (req.method === 'GET') {
      const { rows } = await client.sql`SELECT * FROM todos ORDER BY id ASC;`;
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      const { task } = JSON.parse(req.body);
      await client.sql`INSERT INTO todos (task) VALUES (${task});`;
      return res.status(201).json({ message: 'Success' });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      await client.sql`DELETE FROM todos WHERE id = ${id};`;
      return res.status(200).json({ message: 'Deleted' });
    }

    if (req.method === 'PUT') {
      const { id, done } = JSON.parse(req.body);
      await client.sql`UPDATE todos SET done = ${done} WHERE id = ${id};`;
      return res.status(200).json({ message: 'Updated' });
    }

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
