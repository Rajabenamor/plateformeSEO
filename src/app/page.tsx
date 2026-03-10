import { analyzeUrlAction } from "./actions/auth";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <p className="text-gray-600 mt-2">
        Welcome! 
      </p>
      <form action={analyzeUrlAction}>
        <div className="flex flex-col items-center mt-2 gap-3">
          <input
          name="url"
            type="text"
            placeholder="Lien URL"
            className="border border-2 rounded-lg border-yellow-500"
            
          />
          <button
            type="submit"
            className="px-6 py-2 bg-yellow-200 rounded-lg border-1 border-yellow-500 hover:bg-yellow-300 transition-colors font-medium"
          >
            Analyse
          </button>
        </div>
      </form>
    </div>
  );
}
