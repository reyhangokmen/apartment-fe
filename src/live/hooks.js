import { useCallback, useEffect, useState } from "react";
import { errorMessage } from "../api/client";

/** Bir veriyi yükler; hata mesajını ve yeniden yüklemeyi birlikte verir. */
export function useLoad(loader, deps = []) {
  const [state, setState] = useState({ data: null, error: "", loading: true });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const load = useCallback(loader, deps);

  const reload = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: "" }));
    try {
      const data = await load();
      setState({ data, error: "", loading: false });
    } catch (error) {
      setState({ data: null, error: errorMessage(error), loading: false });
    }
  }, [load]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { ...state, reload };
}

/** Form gönderimlerinde ortak durum: çalışıyor mu, hata, başarı mesajı. */
export function useAction() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const run = useCallback(async (action) => {
    setBusy(true);
    setError("");
    try {
      return await action();
    } catch (e) {
      setError(errorMessage(e));
      return undefined;
    } finally {
      setBusy(false);
    }
  }, []);
  return { busy, error, setError, run };
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
