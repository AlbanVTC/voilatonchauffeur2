'use client';

import { useState } from 'react';
import Modal from './Modal';
import Button from './Button';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export default function LoginModal({
  open,
  onClose,
  onLoginSuccess,
}: LoginModalProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess();
    onClose();
  };

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="text-xl font-semibold text-center mb-4">
        {isRegister ? 'Créer un compte' : 'Connexion'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Mot de passe</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-lg"
          />
        </div>
        <Button fullWidth type="submit">
          {isRegister ? 'S’inscrire' : 'Se connecter'}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        {isRegister
          ? 'Vous avez déjà un compte ?'
          : 'Pas encore de compte ?'}{' '}
        <button
          type="button"
          className="text-blue-600 hover:underline"
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister ? 'Se connecter' : 'Créer un compte'}
        </button>
      </p>
    </Modal>
);
}
