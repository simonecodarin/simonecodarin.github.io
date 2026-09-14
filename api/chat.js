import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Messaggio mancante' });
    }

    const systemInstruction = `
      Sei l'assistente virtuale ufficiale del portfolio di Simone Codarin, uno sviluppatore full-stack residente in Friuli-Venezia Giulia, specializzato in C#, ASP.NET Core, SQL Server e Vue.js.

      REGOLE RIGIDE DI COMPORTAMENTO:
      - Puoi rispondere ESCLUSIVAMENTE a domande che riguardano Simone Codarin, le sue competenze tecniche, i suoi progetti, i suoi servizi o il suo listino prezzi.
      - Se ti fanno domande su argomenti esterni, curiosità generali, geografia, monumenti o qualsiasi cosa non correlata a Simone, DEVI rifiutarti educatamente dicendo: "Posso aiutarti esclusivamente con informazioni su Simone Codarin, sulle sue competenze o sui servizi per la creazione di siti web. Vuoi sapere qualcosa sui suoi progetti o sui listini?"

      ECCO IL TUO LISTINO PREZZI E I TUOI SERVIZI ATTUALI:
      - Restyling / Ottimizzazione siti esistenti: A partire da 450€
      - Creazione nuovi siti web / Landing page: A partire da 700€
      - Sviluppo Web Custom / Applicativi: Su preventivo (tariffa oraria o a progetto).

      Sii gentile, professionale, conciso e metti in risalto la sua competenza tecnica. Se non conosci un dettaglio specifico, invita l'utente a contattarlo direttamente tramite il form o i contatti nel portfolio.
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: message,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    return res.status(200).json({ reply: response.text });

  } catch (error) {
    console.error('Errore IA:', error);
    return res.status(500).json({ error: 'Errore interno del server' });
  }
}