import { apiFetch } from './api';
import { useAuthStore, type AuthUser } from '../store/use-auth-store';
import { usePetStore } from '../store/use-pet-store';

type AuthResponse = {
  sessionToken?: string;
  token?: string;
  user: AuthUser;
};

export async function loginUser(
  email: string,
  password: string
): Promise<void> {
  const resposta = await apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      password,
    }),
  });

  const token = resposta.sessionToken ?? resposta.token;
  if (!token) {
    throw new Error('Token de sessão não retornado pelo servidor.');
  }

  useAuthStore.getState().setSession(token, resposta.user);
}

export async function signupUser(
  name: string,
  email: string,
  password: string
): Promise<void> {
  const emailNormalizado = email.trim().toLowerCase();

  const resposta = await apiFetch<AuthResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({
      name: name.trim(),
      email: emailNormalizado,
      password,
    }),
  });

  const token = resposta.sessionToken ?? resposta.token;
  if (token) {
    useAuthStore.getState().setSession(token, resposta.user);
    return;
  }

  await loginUser(emailNormalizado, password);
}

export async function logoutUser(): Promise<void> {
  try {
    await apiFetch<unknown>('/auth/logout', { method: 'POST' });
  } catch {
    // Ignora falha de rede/endpoint no logout para sempre encerrar a sessão local
  } finally {
    useAuthStore.getState().clearSession();
    usePetStore.getState().clearPets();
  }
}