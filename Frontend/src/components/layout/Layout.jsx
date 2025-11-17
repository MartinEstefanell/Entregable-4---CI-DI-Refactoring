import BackgroundShader from './BackgroundShader.jsx';
import NavBar from '../navbar/NavBar.jsx';

export default function Layout({ children }) {
  return (
    <BackgroundShader>
      <NavBar />
      <main className="flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 pb-16 pt-32 md:px-0">
        {children}
      </main>
    </BackgroundShader>
  );
}
