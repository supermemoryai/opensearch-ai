import { getRequestConfig } from "next-intl/server";
import { headers, cookies } from "next/headers";

export default getRequestConfig(async () => {
  const headersList = headers();

  const acceptLanguage = headersList.get("accept-language") || "en-US";

  const defaultLocale = acceptLanguage.split(",")[0].split(";")[0];

  const locale =
    cookies().get("NEXT_LOCALE")?.value || defaultLocale || "en-US";

  const supportedLocales = {
    "en-US": () => import("../messages/en-US.json"),
    "pt-BR": () => import("../messages/pt-BR.json"),
  };

  type SupportedLocale = keyof typeof supportedLocales;

  const safeLocale = (
    locale in supportedLocales ? locale : "en-US"
  ) as SupportedLocale;

  const messages = await (
    supportedLocales[safeLocale] || supportedLocales["en-US"]
  )();

  return {
    locale,
    messages: messages.default,
  };
});
