import { WHATSAPP_URL } from "@/lib/constants";

export function WhatsAppFab() {
  return (
    <a
      href={WHATSAPP_URL("Bonjour, je voudrais en savoir plus sur vos services 👋")}
      target="_blank"
      rel="noreferrer"
      aria-label="Contacter sur WhatsApp"
      className="fixed bottom-20 right-4 sm:bottom-5 sm:right-5 z-50 flex items-center gap-2 group"
    >
      {/* Tooltip */}
      <span
        className="hidden sm:block bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg
                   opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0
                   transition-all duration-200 pointer-events-none whitespace-nowrap"
        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.12)" }}
      >
        On répond sur WhatsApp !
      </span>

      {/* Bouton principal */}
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg
                   hover:scale-110 active:scale-95 transition-transform duration-150"
        style={{ background: "#25D366", boxShadow: "0 4px 20px rgba(37,211,102,0.45)" }}
      >
        {/* Logo WhatsApp SVG officiel */}
        <svg viewBox="0 0 32 32" width="30" height="30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M16 3C9.373 3 4 8.373 4 15c0 2.385.687 4.605 1.873 6.487L4 29l7.723-1.848A11.94 11.94 0 0016 27c6.627 0 12-5.373 12-12S22.627 3 16 3z"
            fill="white"
          />
          <path
            d="M21.54 18.54c-.28-.14-1.65-.813-1.906-.906-.255-.093-.44-.14-.626.14-.185.28-.72.906-.882 1.093-.163.186-.325.21-.605.07-.28-.14-1.182-.436-2.252-1.39-.832-.742-1.393-1.658-1.557-1.938-.163-.28-.017-.432.123-.571.126-.126.28-.327.42-.49.14-.163.186-.28.28-.466.093-.186.046-.348-.023-.49-.07-.14-.626-1.51-.858-2.068-.226-.543-.456-.47-.626-.478-.163-.009-.348-.01-.534-.01-.186 0-.49.07-.746.348-.256.28-.977.955-.977 2.328 0 1.373 1.001 2.7 1.14 2.886.14.186 1.97 3.007 4.773 4.218.667.288 1.188.46 1.593.59.669.213 1.278.183 1.76.11.537-.08 1.65-.674 1.883-1.326.232-.65.232-1.208.163-1.326-.07-.117-.256-.186-.536-.326z"
            fill="#25D366"
          />
        </svg>
      </div>

      {/* Pulse d'animation */}
      <span
        className="absolute inset-0 rounded-full animate-ping opacity-25 pointer-events-none"
        style={{ background: "#25D366" }}
      />
    </a>
  );
}
