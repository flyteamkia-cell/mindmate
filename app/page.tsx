export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 bg-slate-50">
      <div className="max-w-2xl text-center">

        <div className="text-6xl mb-4">🧠</div>

        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-4">
          MindMate
        </h1>

        <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed">
          ذهن یار ابزار هوش مصنوعی برای بالابردن  کارایی خودته
          
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-6 py-3 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition">
            Get Started
          </button>
          <button className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-white transition">
            Learn More
          </button>
        </div>

      </div>
    </main>
  );
}