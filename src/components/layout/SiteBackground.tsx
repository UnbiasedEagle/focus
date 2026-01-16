export function SiteBackground() {
  return (
    <>
      {/* Background Gradients */}
      <div className='fixed inset-0 -z-20 pointer-events-none overflow-hidden'>
        <div className='absolute top-[-10%] right-[-10%] w-[300px] sm:w-[800px] h-[300px] sm:h-[800px] bg-indigo-500/20 rounded-full blur-[80px] sm:blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-40' />
        <div className='absolute bottom-[-10%] left-[-10%] w-[250px] sm:w-[600px] h-[250px] sm:h-[600px] bg-purple-500/20 rounded-full blur-[60px] sm:blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-40' />
      </div>

      {/* Background Noise Texture */}
      <div className='fixed inset-0 bg-[url("https://grainy-gradients.vercel.app/noise.svg")] opacity-20 pointer-events-none mix-blend-overlay -z-10' />
    </>
  );
}
