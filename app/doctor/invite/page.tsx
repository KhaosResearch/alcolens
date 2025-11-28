/* trunk-ignore-all(prettier/SyntaxError) */
'use client';
  
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

import { Suspense } from 'react';

function InviteContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const router = useRouter();

  const [valid, setValid] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function check() {
      if (!token) return setValid(false);
      setLoading(true);
      try {
        const res = await fetch(`/api/invite/validate?token=${encodeURIComponent(token)}`);
        if (res.ok) {
          const data = await res.json();
          setValid(!!data.valid);
        } else {
          setValid(false);
        }
      } catch (e) {
        setValid(false);
      } finally {
        setLoading(false);
      }
    }
    check();
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const res = await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, answers: { freeText: answers } }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Gracias por completar el cuestionario.');
        setTimeout(() => router.push('/'), 2000);
      } else {
        setMessage(data.error || 'Error al enviar.');
      }
    } catch (e) {
      setMessage('Error en la comunicación.');
    } finally {
      setLoading(false);
    }
  }

  if (loading && valid === null) return <p>Loading...</p>;

  if (!token) return <p>Token missing.</p>;

  if (!valid) return <p>Token inválido o expirado.</p>;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Cuestionario</h2>
        {message && <div className="mb-4 text-green-700">{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Respuesta</label>
            <textarea value={answers} onChange={(e) => setAnswers(e.target.value)} className="w-full border p-2 rounded" />
          </div>
          <div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar respuestas'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

  export default function InvitePage() {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <InviteContent />
      </Suspense>
    );
  }
