import { getDb } from './_db.js';

export default async function handler(req, res) {
  const sql = getDb();
  try {
    if (req.method === 'GET') {
      const rows = await sql`SELECT id, talhao_id, produtor_id, data, quantidade, unidade, umidade, cultura, valor_saca, hectares, observacoes, created_at FROM colheitas ORDER BY created_at DESC`;
      return res.json(rows);
    }
    if (req.method === 'POST') {
      const { id, talhaoId, produtorId, data, quantidade, unidade, umidade, cultura, valorSaca, hectares, observacoes } = req.body;
      if (!id || !data || quantidade == null || !cultura?.trim()) return res.status(400).json({ error: 'id, data, quantidade e cultura são obrigatórios' });
      await sql`INSERT INTO colheitas (id, talhao_id, produtor_id, data, quantidade, unidade, umidade, cultura, valor_saca, hectares, observacoes) VALUES (${id}, ${talhaoId || ''}, ${produtorId || null}, ${data}, ${quantidade}, ${unidade || 'sacas'}, ${umidade || 0}, ${cultura.trim()}, ${valorSaca || null}, ${hectares || 0}, ${observacoes || ''})`;
      return res.json({ ok: true });
    }
    if (req.method === 'PUT') {
      const { id, talhaoId, produtorId, data, quantidade, unidade, umidade, cultura, valorSaca, hectares, observacoes } = req.body;
      if (!id || !data || quantidade == null || !cultura?.trim()) return res.status(400).json({ error: 'id, data, quantidade e cultura são obrigatórios' });
      await sql`UPDATE colheitas SET talhao_id=${talhaoId || ''}, produtor_id=${produtorId || null}, data=${data}, quantidade=${quantidade}, unidade=${unidade || 'sacas'}, umidade=${umidade || 0}, cultura=${cultura.trim()}, valor_saca=${valorSaca || null}, hectares=${hectares || 0}, observacoes=${observacoes || ''} WHERE id=${id}`;
      return res.json({ ok: true });
    }
    if (req.method === 'DELETE') {
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: 'id é obrigatório' });
      await sql`DELETE FROM colheitas WHERE id=${id}`;
      return res.json({ ok: true });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
