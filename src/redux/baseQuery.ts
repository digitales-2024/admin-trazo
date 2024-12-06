import { translateError } from "@/utils/translateError";
import { BaseQueryFn } from "@reduxjs/toolkit/query";
import {
    fetchBaseQuery,
    FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
    credentials: "include", // Envía cookies HttpOnly en cada solicitud
});

export type QueryError = {
    name: string;
    message: string;
    stack: string;
};

type ServerError = {
    error: string;
    message?: string;
    statusCode: number;
};
type ReduxError = {
    data?: ServerError;
    status: number | string;
    error?: string;
};

const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
    // Realiza la solicitud inicial
    let result = await baseQuery(args, api, extraOptions);

    // Verifica si el error es 401 (no autorizado)
    if (result.error && (result.error as FetchBaseQueryError).status === 401) {
        const originalRequest = args as { url: string };
        const isLoginRequest = originalRequest.url.includes("/auth/login");

        if (isLoginRequest) {
            return result;
        }

        // Intento de refresco de token con el endpoint /auth/refresh-token
        const refreshResult = await baseQuery(
            { url: "/auth/refresh-token", method: "POST" },
            api,
            extraOptions,
        );

        if (refreshResult.data) {
            // Si el refresco del token fue exitoso, se reintenta la solicitud original
            result = await baseQuery(args, api, extraOptions);
        } else {
            // Si el refresco del token falló, cierra sesión y redirige al login
            await baseQuery(
                { url: "/auth/logout", method: "POST" },
                api,
                extraOptions,
            );

            // Opcional: despacha una acción para actualizar el estado de autenticación en Redux
            // api.dispatch(logoutAction());

            // Redirecciona al usuario a la página de inicio de sesión
            window.location.href = "/log-in";
        }
    }

    return result;
};

/**
 * Crea una `Promise` que maneja errores del backend.
 *
 * Si `fn` se ejecuta normalmente, devuelve el resultado.
 *
 * Si `fn` lanza un error:
 * - Intenta obtener el mensaje de error
 * - Traduce el mensaje de error
 * - Lanza el mensaje traducido, listo para usarse en un toast
 *
 * Devuelve `Promise<Output, {message: string}>`
 *
 * @example
 *
 * ```typescript
 * const promise = runAndHandleError(() => reactivate({ ids: [id] }).unwrap())
 * toast.promise(promise, {
 *     loading: "Reactivando partidas...",
 *     success: "Partidas reactivadas con éxito",
 *     error: (err) => err,
 * })
 * return await promise;
 * ```
 */
export function runAndHandleError<Output>(
    fn: () => Promise<Output>,
): Promise<Output> {
    return new Promise((resolve, reject) => {
        fn()
            .then((res) => resolve(res))
            .catch((err: ReduxError) => {
                // Obtener el msg de error, o utilizar uno por defecto
                let error_msg = "";
                if (err.data && err.data.message) {
                    error_msg = err.data.message;
                } else if (err.error) {
                    error_msg = err.error;
                }

                // Despues de intentar obtener el msg de error, si esta vacio,
                // usar un msg de error por defecto.
                error_msg =
                    "Ocurrió un error inesperado, por favor intenta de nuevo";

                // traducir y relanzar
                reject({
                    message: translateError(error_msg),
                });
            });
    });
}

export default baseQueryWithReauth;
