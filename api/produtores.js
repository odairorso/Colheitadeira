import { getDb } from './_db.js';

export default async function handler(req, res) {
  const sql = getDb();
  try {
    if (req.method === 'GET') {
      const rows = await sql`SELECT id, nome, telefone, endereco, observacoes, created_at FROM produtores ORDER BY created_at DESC`;
      return res.json(rows);
    }
    if (req.method === 'POST') {
      const { id, nome, telefone, endereco, observacoes } = req.body;
      await sql`INSERT INTO produtores (id, nome, telefone, endereco, observacoes) VALUES (${id}, ${nome}, ${telefone || ''}, ${endereco || ''}, ${observacoes || ''})`;
      return res.json({ ok: true });
    }
    if (req.method === 'PUT') {
      const { id, nome, telefone, endereco, observacoes } = req.body;
      await sql`UPDATE produtores SET nome=${nome}, telefone=${telefone || ''}, endereco=${endereco || ''}, observacoes=${observacoes || ''} WHERE id=${id}`;
      return res.json({ ok: true });
    }
    if (req.method === 'DELETE') {
      const { id } = req.body;
      await sql`DELETE FROM produtores WHERE id=${id}`;
      return res.json({ ok: true });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
