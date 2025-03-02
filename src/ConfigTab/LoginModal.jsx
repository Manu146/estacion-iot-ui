import { useState } from "preact/hooks";
import { Lock, X } from "lucide-preact";
import Modal from "react-modal";

export default function LoginModal({
  isOpen,
  loginFn,
  closeModal,
  closeModalBack,
}) {
  const [password, setPassword] = useState("");
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModalBack}
      className="shadow-lg max-w-lg sm:max-w-md flex flex-col absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 dark:bg-gray-900 bg-white p-6 rounded-lg border dark:border-gray-700 border-gray-300"
      overlayClassName="fixed top-0 left-0 dark:bg-gray-950/90 bg-gray-200/75 w-full h-full backdrop-blur-sm"
    >
      <button
        onClick={closeModalBack}
        className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity dark:text-gray-800 text-gray-500"
      >
        <X size={16} />
      </button>
      <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-950 dark:text-gray-50">
        <Lock />
        Autenticación requerida
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Por favor ingrese la contraseña de administrador para acceder a la
        configuración.
      </p>
      <form
        className="py-4"
        onSubmit={(e) => {
          e.preventDefault();
          loginFn(password);
          closeModal();
        }}
      >
        <div class="mt-6">
          <label
            for="password"
            class="block mb-2 text-sm font-medium text-gray-950 dark:text-gray-50"
          >
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Contraseña de administrador"
            required
          />
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={closeModalBack}
            type="button"
            class="font-semibold focus:outline-none text-gray-700 dark:text-white bg-white hover:bg-gray-100 focus:ring-4 focus:ring-green-300 rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-900 dark:hover:bg-gray-800 dark:focus:ring-green-800 border border-gray-400 dark:border-gray-700"
          >
            Cancelar
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              loginFn(password);
              closeModal();
            }}
            type="button"
            class="font-semibold focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            Acceder
          </button>
        </div>
      </form>
    </Modal>
  );
}
