import React from 'react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {

const actualMonth = new Date().toLocaleString('default', { month: 'long' });
const actualYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h1 className="text-3xl font-bold mb-6">Informativa sulla Privacy</h1>
        <p className="text-sm text-slate-500 mb-8">Ultimo aggiornamento: {actualMonth.charAt(0).toUpperCase() + actualMonth.slice(1)} {actualYear}</p>

        <div className="space-y-6 text-sm leading-relaxed text-slate-700">
          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">1. Titolare del Trattamento</h2>
            <p>Il titolare del trattamento dei dati è Simone Codarin. Puoi contattarmi direttamente tramite i canali indicati nella sezione contatti del sito.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">2. Dati raccolti e Finalità</h2>
            <p>Attraverso il modulo di contatto presente sul sito, vengono raccolti dati personali facoltativi (Nome, Email e il messaggio inserito dall'utente). Tali dati vengono utilizzati <strong>esclusivamente</strong> per rispondere alle richieste inviate dall'utente stesso e non vengono ceduti a terze parti né utilizzati per finalità commerciali o di profilazione.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">3. Cookie e Tracciamento</h2>
            <p>Questo sito non utilizza cookie di profilazione o strumenti di tracciamento pubblicitario di terze parti. Viene impiegato esclusivamente Google Search Console per l'analisi tecnica del posizionamento sui motori di ricerca, senza installare cookie di tracciamento sul browser dell'utente.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">4. Diritti dell'utente</h2>
            <p>In qualità di utente, hai il diritto in qualunque momento di richiedere l'accesso, la rettifica o la cancellazione dei dati inviati tramite il form, scrivendo direttamente ai recapiti di contatto.</p>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <Link to="/" className="text-blue-600 hover:underline font-medium text-sm">
            ← Torna alla home
          </Link>
        </div>
      </div>
    </div>
  );
}