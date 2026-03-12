import { getDb } from './_db.js';

export default async function handler(req, res) {
  const sql = getDb();
  try {
    if (req.method === 'GET') {
      const rows = await sql`SELECT id, nome, tipo, telefone, endereco, cidade, estado, observacoes, created_at FROM empresas ORDER BY created_at DESC`;
      return res.json(rows);
    }
    if (req.method === 'POST') {
      const { id, nome, tipo, telefone, endereco, cidade, estado, observacoes } = req.body;
      await sql`INSERT INTO empresas (id, nome, tipo, telefone, endereco, cidade, estado, observacoes) VALUES (${id}, ${nome}, ${tipo || 'pecas'}, ${telefone || ''}, ${endereco || ''}, ${cidade || ''}, ${estado || ''}, ${observacoes || ''})`;
      return res.json({ ok: true });
    }
    if (req.method === 'PUT') {
      const { id, nome, tipo, telefone, endereco, cidade, estado, observacoes } = req.body;
      await sql`UPDATE empresas SET nome=${nome}, tipo=${tipo}, telefone=${telefone || ''}, endereco=${endereco || ''}, cidade=${cidade || ''}, estado=${estado || ''}, observacoes=${observacoes || ''} WHERE id=${id}`;
      return res.json({ ok: true });
    }
    if (req.method === 'DELETE') {
      const { id } = req.body;
      await sql`DELETE FROM empresas WHERE id=${id}`;
      return res.json({ ok: true });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
