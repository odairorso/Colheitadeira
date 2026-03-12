import { getDb } from './_db.js';

export default async function handler(req, res) {
  const sql = getDb();
  try {
    if (req.method === 'GET') {
      const rows = await sql`SELECT id, nome, area_hectares, cultura, safra, observacoes, created_at FROM talhoes ORDER BY created_at DESC`;
      return res.json(rows);
    }
    if (req.method === 'POST') {
      const { id, nome, area_hectares, cultura, safra, observacoes } = req.body;
      await sql`INSERT INTO talhoes (id, nome, area_hectares, cultura, safra, observacoes) VALUES (${id}, ${nome}, ${area_hectares || 0}, ${cultura || ''}, ${safra || ''}, ${observacoes || ''})`;
      return res.json({ ok: true });
    }
    if (req.method === 'PUT') {
      const { id, nome, area_hectares, cultura, safra, observacoes } = req.body;
      await sql`UPDATE talhoes SET nome=${nome}, area_hectares=${area_hectares || 0}, cultura=${cultura || ''}, safra=${safra || ''}, observacoes=${observacoes || ''} WHERE id=${id}`;
      return res.json({ ok: true });
    }
    if (req.method === 'DELETE') {
      const { id } = req.body;
      await sql`DELETE FROM talhoes WHERE id=${id}`;
      return res.json({ ok: true });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
