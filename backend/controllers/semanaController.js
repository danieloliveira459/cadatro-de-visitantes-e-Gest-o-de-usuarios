import { db } from "../config/db.js";
import { getSegundaFeira } from "../utils/semana.js";

// ─── LISTAR SEMANAS (histórico) ───────────────────────────────────────────────
// Retorna todas as semanas distintas que têm dados em qualquer tabela,
// junto com os totais de cada uma para exibir no front.
export const listarSemanas = async (req, res) => {
  try {
    // Coleta todas as semanas únicas de todas as tabelas rastreadas
    const [rows] = await db.query(`
      SELECT DISTINCT semana FROM (
        SELECT semana FROM visitantes      WHERE semana IS NOT NULL
        UNION ALL
        SELECT semana FROM aceitaram_jesus WHERE semana IS NOT NULL
        UNION ALL
        SELECT semana FROM cadastro_geral  WHERE semana IS NOT NULL
        UNION ALL
        SELECT semana FROM avisos          WHERE semana IS NOT NULL
        UNION ALL
        SELECT semana FROM programacao     WHERE semana IS NOT NULL
        UNION ALL
        SELECT semana FROM crianca         WHERE semana IS NOT NULL
        UNION ALL
        SELECT semana FROM jovens          WHERE semana IS NOT NULL
        UNION ALL
        SELECT semana FROM mulheres        WHERE semana IS NOT NULL
        UNION ALL
        SELECT semana FROM homens          WHERE semana IS NOT NULL
      ) AS todas
      ORDER BY semana DESC
    `);

    const semanaAtual = getSegundaFeira();

    // Para cada semana, busca os totais de cada tabela
    const semanas = await Promise.all(
      rows.map(async ({ semana }) => {
        const [
          [v], [a], [cg], [av], [pr], [cr], [jo], [mu], [ho]
        ] = await Promise.all([
          db.query("SELECT COUNT(*) AS total FROM visitantes      WHERE semana = ?", [semana]),
          db.query("SELECT COUNT(*) AS total FROM aceitaram_jesus WHERE semana = ?", [semana]),
          db.query("SELECT COUNT(*) AS total FROM cadastro_geral  WHERE semana = ?", [semana]),
          db.query("SELECT COUNT(*) AS total FROM avisos          WHERE semana = ?", [semana]),
          db.query("SELECT COUNT(*) AS total FROM programacao     WHERE semana = ?", [semana]),
          db.query("SELECT COUNT(*) AS total FROM crianca         WHERE semana = ?", [semana]),
          db.query("SELECT COUNT(*) AS total FROM jovens          WHERE semana = ?", [semana]),
          db.query("SELECT COUNT(*) AS total FROM mulheres        WHERE semana = ?", [semana]),
          db.query("SELECT COUNT(*) AS total FROM homens          WHERE semana = ?", [semana]),
        ]);

        // Calcula o sábado da semana (segunda + 5 dias)
        const seg = new Date(semana + "T00:00:00");
        const sab = new Date(seg);
        sab.setDate(seg.getDate() + 5);
        const fim = sab.toISOString().split("T")[0];

        return {
          semana,                          // "2026-04-21" (segunda-feira)
          fim,                             // "2026-04-26" (sábado)
          atual: semana === semanaAtual,   // true = semana corrente
          visitantes:     Number(v[0].total),
          aceitaramJesus: Number(a[0].total),
          cadastroGeral:  Number(cg[0].total),
          avisos:         Number(av[0].total),
          programacoes:   Number(pr[0].total),
          criancas:       Number(cr[0].total),
          jovens:         Number(jo[0].total),
          mulheres:       Number(mu[0].total),
          homens:         Number(ho[0].total),
        };
      })
    );

    return res.json(semanas);
  } catch (err) {
    console.error("ERRO LISTAR SEMANAS:", err);
    return res.status(500).json({ error: "Erro ao listar semanas" });
  }
};

// ─── DADOS DE UMA SEMANA ESPECÍFICA ──────────────────────────────────────────
// Recebe :semana no formato "2026-04-21" (segunda-feira da semana desejada)
export const dadosDaSemana = async (req, res) => {
  try {
    const { semana } = req.params;

    if (!semana || !/^\d{4}-\d{2}-\d{2}$/.test(semana)) {
      return res.status(400).json({ error: "Parâmetro semana inválido. Use YYYY-MM-DD." });
    }

    const [
      [visitantes],
      [aceitaramJesus],
      [cadastroGeral],
      [avisos],
      [programacoes],
      [criancas],
      [jovens],
      [mulheres],
      [homens],
    ] = await Promise.all([
      db.query("SELECT * FROM visitantes      WHERE semana = ? ORDER BY id DESC",        [semana]),
      db.query("SELECT * FROM aceitaram_jesus WHERE semana = ? ORDER BY data DESC",      [semana]),
      db.query("SELECT * FROM cadastro_geral  WHERE semana = ? ORDER BY data DESC",      [semana]),
      db.query("SELECT * FROM avisos          WHERE semana = ? ORDER BY id DESC",        [semana]),
      db.query("SELECT id, dia, horario, atividade, data, dataAtividade FROM programacao WHERE semana = ? ORDER BY id DESC", [semana]),
      db.query("SELECT * FROM crianca         WHERE semana = ? ORDER BY created_at DESC",[semana]),
      db.query("SELECT * FROM jovens          WHERE semana = ? ORDER BY created_at DESC",[semana]),
      db.query("SELECT * FROM mulheres        WHERE semana = ? ORDER BY created_at DESC",[semana]),
      db.query("SELECT * FROM homens          WHERE semana = ? ORDER BY created_at DESC",[semana]),
    ]);

    return res.json({
      visitantes,
      aceitaramJesus,
      cadastroGeral,
      avisos,
      programacoes,
      criancas,
      jovens,
      mulheres,
      homens,
    });
  } catch (err) {
    console.error("ERRO DADOS SEMANA:", err);
    return res.status(500).json({ error: "Erro ao buscar dados da semana" });
  }
};
