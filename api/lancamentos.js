import { getDb } from './_db.js';

export default async function handler(req, res) {
  const sql = getDb();
  try {
    if (req.method === 'GET') {
      const rows = await sql`SELECT id, tipo, categoria, descricao, valor, data, talhao_id, empresa_id, produtor_id, created_at FROM lancamentos ORDER BY created_at DESC`;
      return res.json(rows);
    }
    if (req.method === 'POST') {
      const { id, tipo, categoria, descricao, valor, data, talhaoId, empresaId, produtorId } = req.body;
      if (!id || !tipo || !categoria || valor == null || !data) return res.status(400).json({ error: 'id, tipo, categoria, valor e data são obrigatórios' });
      if (!['receita', 'despesa'].includes(tipo)) return res.status(400).json({ error: 'tipo deve ser receita ou despesa' });
      await sql`INSERT INTO lancamentos (id, tipo, categoria, descricao, valor, data, talhao_id, empresa_id, produtor_id) VALUES (${id}, ${tipo}, ${categoria}, ${descricao || ''}, ${valor}, ${data}, ${talhaoId || null}, ${empresaId || null}, ${produtorId || null})`;
      return res.json({ ok: true });
    }
    if (req.method === 'PUT') {
      const { id, tipo, categoria, descricao, valor, data, talhaoId, empresaId, produtorId } = req.body;
      if (!id || !tipo || !categoria || valor == null || !data) return res.status(400).json({ error: 'id, tipo, categoria, valor e data são obrigatórios' });
      if (!['receita', 'despesa'].includes(tipo)) return res.status(400).json({ error: 'tipo deve ser receita ou despesa' });
      await sql`UPDATE lancamentos SET tipo=${tipo}, categoria=${categoria}, descricao=${descricao || ''}, valor=${valor}, data=${data}, talhao_id=${talhaoId || null}, empresa_id=${empresaId || null}, produtor_id=${produtorId || null} WHERE id=${id}`;
      return res.json({ ok: true });
    }
    if (req.method === 'DELETE') {
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: 'id é obrigatório' });
      await sql`DELETE FROM lancamentos WHERE id=${id}`;
      return res.json({ ok: true });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
