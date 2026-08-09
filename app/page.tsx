import { redirect } from 'next/navigation';

/** La entrada a módulos/formularios es solo el menú lateral. */
export default function HomePage() {
  redirect('/dashboard');
}
