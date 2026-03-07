export default function Home() {
  return (
    <div className="">
      <p className="text-gray-600 mt-2">
        Welcome! You are seeing this because you are securely logged in.
      </p>
      <form action="">
        <div className="flex flex-col items-center mt-2">
          <input
            type="text"
            placeholder="Lien URL"
            className="border border-2 rounded-lg border-yellow-500"
          />
          <button
            type="submit"
            className="bg-yellow-200 rounded-lg border-1 border-yellow-500"
          >
            analyse
          </button>
        </div>
      </form>
    </div>
  );
}
