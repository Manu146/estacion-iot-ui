export default function ConfigSectionCard({ card }) {
  const { icon: Icon, title, text, name } = card;
  return (
    <div className="rounded-lg border bg-white dark:bg-gray-900 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-950 dark:text-gray-50 border-gray-200 dark:border-gray-700">
      <div className="p-6 pb-2 flex flex-row items-center gap-2">
        <div className="rounded-full bg-green-600/50 p-2 text-primary">
          <Icon />
        </div>
        <div className="">
          <h3 className="font-semibold text-base">{title}</h3>
        </div>
      </div>
      <div className="p-6 pt-0">
        <p className="text-sm text-gray-500 dark:text-gray-400">{text}</p>
        <a
          href={`/configuracion/${name}`}
          className="p-1 inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold h-10 mt-2 w-full justify-start text-green-700 transition-colors hover:bg-gray-300 hover:text-gray-800 dark:hover:bg-gray-700 dark:hover:text-gray-300"
        >
          Configurar
        </a>
      </div>
    </div>
  );
}
