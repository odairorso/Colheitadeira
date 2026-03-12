import { getDb } from './_db.js';

export default async function handler(req, res) {
  const sql = getDb();
  try {
    if (req.method === 'GET') {
      const rows = await sql`SELECT id, talhao_id, produtor_id, data, quantidade, unidade, umidade, cultura, valor_saca, observacoes, created_at FROM colheitas ORDER BY created_at DESC`;
      return res.json(rows);
    }
    if (req.method === 'POST') {
      const { id, talhaoId, produtorId, data, quantidade, unidade, umidade, cultura, valorSaca, observacoes } = req.body;
      await sql`INSERT INTO colheitas (id, talhao_id, produtor_id, data, quantidade, unidade, umidade, cultura, valor_saca, observacoes) VALUES (${id}, ${talhaoId || ''}, ${produtorId || null}, ${data}, ${quantidade}, ${unidade || 'sacas'}, ${umidade || 0}, ${cultura}, ${valorSaca || null}, ${observacoes || ''})`;
      return res.json({ ok: true });
    }
    if (req.method === 'PUT') {
      const { id, talhaoId, produtorId, data, quantidade, unidade, umidade, cultura, valorSaca, observacoes } = req.body;
      await sql`UPDATE colheitas SET talhao_id=${talhaoId || ''}, produtor_id=${produtorId || null}, data=${data}, quantidade=${quantidade}, unidade=${unidade || 'sacas'}, umidade=${umidade || 0}, cultura=${cultura}, valor_saca=${valorSaca || null}, observacoes=${observacoes || ''} WHERE id=${id}`;
      return res.json({ ok: true });
    }
    if (req.method === 'DELETE') {
      const { id } = req.body;
      await sql`DELETE FROM colheitas WHERE id=${id}`;
      return res.json({ ok: true });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
