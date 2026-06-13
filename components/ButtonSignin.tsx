export default function ButtonSignin({ extraStyle }: { extraStyle?: string }) {
  return (
    <button className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition ${extraStyle}`}>
      Sign In
    </button>
  );
}
